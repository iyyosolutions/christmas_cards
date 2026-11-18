import { notFound } from "next/navigation";
import { CardStudio } from "@/components/cards/card-studio";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { designIds, getTemplate } from "@/lib/templates";

export default async function CreatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const local = getTemplate(templateId);
  let resolved = local
    ? { id: local.id, name: local.name, category: local.category, tagline: local.tagline, design: local.id }
    : null;

  let senderName = "";
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const query = supabase.from("templates").select("id, name, category, description, template_config, is_active");
    const { data: template } = local
      ? await query.contains("template_config", { design: local.id }).eq("is_active", true).maybeSingle()
      : await query.eq("id", templateId).maybeSingle();
    const design = template?.template_config?.design;
    if (template?.is_active && typeof design === "string" && designIds.includes(design)) {
      resolved = {
        id: template.id,
        name: template.name,
        category: template.category,
        tagline: template.description,
        design,
      };
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const meta = user?.user_metadata?.display_name;
    senderName = typeof meta === "string" ? meta : user?.email?.split("@")[0] || "";
  }

  if (!resolved) notFound();

  return (
    <CardStudio
      designId={resolved.design}
      senderName={senderName}
      template={{
        id: resolved.id,
        name: resolved.name,
        category: resolved.category,
        tagline: resolved.tagline,
        mood: resolved.category,
      }}
    />
  );
}
