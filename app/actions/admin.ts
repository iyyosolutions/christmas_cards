"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { designIds } from "@/lib/templates";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "Sign in first." as const };
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile?.is_admin) return { supabase, error: "Only an administrator can do that." as const };
  return { supabase, error: null };
}

const details = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(60),
  description: z.string().trim().min(4).max(240),
  design: z.string().refine((value) => designIds.includes(value), "Choose a design."),
  isActive: z.boolean(),
});

async function storePreview(supabase: Awaited<ReturnType<typeof createClient>>, file: FormDataEntryValue | null, id: string) {
  if (!(file instanceof File) || file.size === 0) return { path: undefined as string | undefined };
  if (file.size > 2_000_000) return { error: "Preview images must be under 2 MB." };
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return { error: "Use a PNG, JPG, or WebP image." };
  }
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${id}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("template-images").upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) return { error: error.message };
  return { path: supabase.storage.from("template-images").getPublicUrl(path).data.publicUrl };
}

export async function saveTemplate(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };
  const parsed = details.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    design: formData.get("design"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the template." };

  const existingId = String(formData.get("id") || "");
  const id = existingId || crypto.randomUUID();
  const preview = await storePreview(admin.supabase, formData.get("preview"), id);
  if ("error" in preview && preview.error) return { error: preview.error };

  const row = {
    id,
    name: parsed.data.name,
    category: parsed.data.category,
    description: parsed.data.description,
    template_config: { design: parsed.data.design },
    is_active: parsed.data.isActive,
    ...(preview.path ? { preview_image: preview.path } : {}),
  };

  const { error } = existingId
    ? await admin.supabase.from("templates").update(row).eq("id", existingId)
    : await admin.supabase.from("templates").insert(row);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/templates");
  return { ok: true };
}

export async function deleteTemplate(id: string) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };
  const { error } = await admin.supabase.from("templates").delete().eq("id", id);
  if (error) return { error: "This template is used by existing cards, so it cannot be deleted. Deactivate it instead." };
  revalidatePath("/admin");
  revalidatePath("/templates");
  return { ok: true };
}

export async function setTemplateActive(id: string, isActive: boolean) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };
  const { error } = await admin.supabase.from("templates").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/templates");
  return { ok: true };
}
