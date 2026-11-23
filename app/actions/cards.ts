"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isResendConfigured, isSupabaseConfigured } from "@/lib/env";
import { cardUrl } from "@/lib/utils";
import { designIds } from "@/lib/templates";

const cardSchema = z
  .object({
    templateId: z.string().min(1),
    wishMode: z.enum(["general", "personal"]),
    recipientName: z.string().trim().max(40),
    message: z.string().trim().max(2000),
    senderName: z.string().trim().max(40),
    wishes: z.array(z.object({
      message: z.string().trim().min(1, "Write the wish.").max(240),
      senderName: z.string().trim().max(40),
    })).max(8).optional(),
    textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    fontStyle: z.enum(["serif", "sans", "script"]),
    textAlign: z.enum(["left", "center"]),
    imageDataUrl: z.string().startsWith("data:image/png;base64,"),
    photoDataUrl: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.wishMode === "personal" && value.recipientName.length < 1) {
      context.addIssue({ code: "custom", message: "Add the recipient's name.", path: ["recipientName"] });
    }
    if (value.wishMode === "general" && value.message.trim().length < 1) {
      context.addIssue({ code: "custom", message: "Write the wish.", path: ["message"] });
    }
    if (value.wishMode === "personal" && (!value.wishes || value.wishes.length < 1)) {
      context.addIssue({ code: "custom", message: "Add at least one wish.", path: ["wishes"] });
    }
  });

export async function saveCard(input: {
  templateId: string;
  wishMode: "general" | "personal";
  recipientName: string;
  message: string;
  senderName: string;
  wishes?: { message: string; senderName: string }[];
  photoDataUrl?: string;
  style?: { textColor?: string; fontStyle?: "serif" | "sans" | "script"; textAlign?: "left" | "center" };
  imageDataUrl?: string;
}) {
  if (!isSupabaseConfigured()) {
    return { error: "Connect Supabase before saving cards." };
  }
  const parsed = cardSchema.safeParse({
    ...input,
    textColor: input.style?.textColor,
    fontStyle: input.style?.fontStyle ?? "serif",
    textAlign: input.style?.textAlign ?? "left",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the card." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save a card." };

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("cards")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= 8) return { error: "You have created several cards this hour. Please wait a little, then try again." };

  const lookup = supabase.from("templates").select("id, is_active, template_config").eq("is_active", true);
  const { data: template } = designIds.includes(parsed.data.templateId)
    ? await lookup.contains("template_config", { design: parsed.data.templateId }).maybeSingle()
    : await lookup.eq("id", parsed.data.templateId).maybeSingle();
  const design = template?.template_config?.design;
  if (!template?.is_active || typeof design !== "string" || !designIds.includes(design)) {
    return { error: "That template is not available." };
  }

  const token = randomBytes(18).toString("base64url");
  const base64 = parsed.data.imageDataUrl.split(",")[1];
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > 4_000_000) return { error: "The card image is too large." };
  const imagePath = `${user.id}/${token}.png`;
  const { error: uploadError } = await supabase.storage
    .from("card-images")
    .upload(imagePath, bytes, { contentType: "image/png", upsert: false });
  if (uploadError) return { error: uploadError.message };
  const cardImageUrl = supabase.storage.from("card-images").getPublicUrl(imagePath).data.publicUrl;
  const attachment = await storeAttachment(supabase, user.id, token, parsed.data.photoDataUrl);
  if (attachment.error) return { error: attachment.error };

  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id: user.id,
      owner_email: user.email ?? null,
      template_id: template.id,
      recipient_name: parsed.data.wishMode === "personal" ? parsed.data.recipientName : null,
      message: parsed.data.wishMode === "personal"
        ? (parsed.data.wishes ?? []).map((wish) => wish.message).join("\n\n")
        : parsed.data.message,
      sender_name: parsed.data.wishMode === "personal"
        ? parsed.data.wishes?.[0]?.senderName || "With love"
        : parsed.data.senderName || "With love",
      card_image_url: cardImageUrl,
      share_token: token,
      is_public: true,
      design_options: {
        wishMode: parsed.data.wishMode,
        textColor: parsed.data.textColor ?? null,
        fontStyle: parsed.data.fontStyle,
        textAlign: parsed.data.textAlign,
        design,
        wishes: parsed.data.wishMode === "personal" ? parsed.data.wishes ?? [] : [],
        attachment: attachment.url,
      },
    })
    .select("share_token")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/cards");
  revalidatePath("/dashboard");
  return { slug: data.share_token as string };
}

export async function updateCard(id: string, input: {
  templateId: string;
  wishMode: "general" | "personal";
  recipientName: string;
  message: string;
  senderName: string;
  wishes?: { message: string; senderName: string }[];
  photoDataUrl?: string;
  style?: { textColor?: string; fontStyle?: "serif" | "sans" | "script"; textAlign?: "left" | "center" };
  imageDataUrl?: string;
}) {
  if (!isSupabaseConfigured()) return { error: "Connect Supabase before saving cards." };
  const parsed = cardSchema.safeParse({
    ...input,
    textColor: input.style?.textColor,
    fontStyle: input.style?.fontStyle ?? "serif",
    textAlign: input.style?.textAlign ?? "left",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the card." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to edit a card." };

  const { data: existing } = await supabase
    .from("cards")
    .select("id, share_token")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!existing) return { error: "That card could not be found." };

  const lookup = supabase.from("templates").select("id, is_active, template_config").eq("is_active", true);
  const { data: template } = designIds.includes(parsed.data.templateId)
    ? await lookup.contains("template_config", { design: parsed.data.templateId }).maybeSingle()
    : await lookup.eq("id", parsed.data.templateId).maybeSingle();
  const design = template?.template_config?.design;
  if (!template?.is_active || typeof design !== "string" || !designIds.includes(design)) {
    return { error: "That template is not available." };
  }

  const base64 = parsed.data.imageDataUrl.split(",")[1];
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > 4_000_000) return { error: "The card image is too large." };
  const imagePath = `${user.id}/${existing.share_token}.png`;
  const { error: uploadError } = await supabase.storage
    .from("card-images")
    .upload(imagePath, bytes, { contentType: "image/png", upsert: true });
  if (uploadError) return { error: uploadError.message };
  const cardImageUrl = supabase.storage.from("card-images").getPublicUrl(imagePath).data.publicUrl;
  const attachment = await storeAttachment(supabase, user.id, existing.share_token, parsed.data.photoDataUrl);
  if (attachment.error) return { error: attachment.error };

  const { error } = await supabase
    .from("cards")
    .update({
      template_id: template.id,
      recipient_name: parsed.data.wishMode === "personal" ? parsed.data.recipientName : null,
      message: parsed.data.wishMode === "personal"
        ? (parsed.data.wishes ?? []).map((wish) => wish.message).join("\n\n")
        : parsed.data.message,
      sender_name: parsed.data.wishMode === "personal"
        ? parsed.data.wishes?.[0]?.senderName || "With love"
        : parsed.data.senderName || "With love",
      card_image_url: cardImageUrl,
      design_options: {
        wishMode: parsed.data.wishMode,
        textColor: parsed.data.textColor ?? null,
        fontStyle: parsed.data.fontStyle,
        textAlign: parsed.data.textAlign,
        design,
        wishes: parsed.data.wishMode === "personal" ? parsed.data.wishes ?? [] : [],
        attachment: attachment.url,
      },
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/cards");
  revalidatePath(`/card/${existing.share_token}`);
  return { slug: existing.share_token as string };
}

export async function deleteCard(id: string) {
  if (!isSupabaseConfigured()) return { error: "Supabase is not configured." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const { error } = await supabase.from("cards").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/cards");
  revalidatePath("/dashboard");
  return { ok: true };
}

const emailSchema = z.object({
  slug: z.string().min(4),
  to: z.string().email("Enter the recipient's email."),
});

export async function sendCardEmail(input: { slug: string; to: string }) {
  if (!isResendConfigured()) {
    return { error: "Add RESEND_API_KEY and RESEND_FROM_EMAIL to send email." };
  }
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the email." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in before sending a card." };

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("card_shares")
    .select("id", { count: "exact", head: true })
    .eq("sharing_method", "email")
    .gte("sent_at", hourAgo);
  if ((count ?? 0) >= 10) return { error: "Email sending is paused for a little while. Try again later." };

  const { data: card } = await supabase
    .from("cards")
    .select("id, user_id, sender_name, recipient_name, share_token")
    .eq("share_token", parsed.data.slug)
    .maybeSingle();
  if (!card) return { error: "That card could not be found." };
  if (card.user_id !== user.id) return { error: "Only the person who made this card can send it." };

  const link = cardUrl(card.share_token);
  const recipient = escapeHtml(card.recipient_name ?? "");
  const sender = escapeHtml(card.sender_name);
  const greeting = recipient ? `Dear ${recipient},` : "";
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: parsed.data.to,
    subject: `${card.sender_name} sent you a Christmas card`,
    html: `
      <div style="margin:0;background:#143028;padding:32px;font-family:Georgia,serif;color:#f8f1df;">
        <p style="letter-spacing:0.28em;text-transform:uppercase;font-size:12px;color:#e7d3a1;">Send A Wish</p>
        <div style="margin-top:16px;background:#fbf7ef;color:#241c16;border-radius:24px;padding:32px;">
          <h1 style="font-weight:normal;font-size:32px;margin:0;">${greeting}</h1>
          <p style="font-size:18px;line-height:1.6;">${sender} wrote a Christmas card and asked us to bring it to you.</p>
          <p style="margin-top:28px;">
            <a href="${link}" style="background:#8d2c3b;color:#fbf7ef;text-decoration:none;padding:14px 22px;border-radius:999px;display:inline-block;">View Your Christmas Card</a>
          </p>
          <p style="margin-top:24px;font-size:14px;color:#5c5148;">Or open this link:<br><a href="${link}" style="color:#8d2c3b;">${link}</a></p>
        </div>
      </div>
    `,
  });

  if (error) {
    await supabase.from("card_shares").insert({
      card_id: card.id,
      recipient_email: parsed.data.to,
      sharing_method: "email",
      delivery_status: "failed",
    });
    return { error: error.message };
  }
  await supabase.from("card_shares").insert({
    card_id: card.id,
    recipient_email: parsed.data.to,
    sharing_method: "email",
    delivery_status: "sent",
  });
  return { ok: true };
}

async function storeAttachment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  token: string,
  photo?: string,
) {
  if (!photo) return { url: null as string | null };
  if (photo.startsWith("http")) return { url: photo };
  const match = photo.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!match) return { error: "Use a PNG, JPG, or WebP image." };
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 2_000_000) return { error: "The attached image must be under 2 MB." };
  const ext = match[1] === "jpeg" || match[1] === "jpg" ? "jpg" : match[1];
  const path = `${userId}/${token}-photo.${ext}`;
  const { error } = await supabase.storage.from("card-images").upload(path, bytes, {
    contentType: ext === "jpg" ? "image/jpeg" : `image/${ext}`,
    upsert: true,
  });
  if (error) return { error: error.message };
  return { url: supabase.storage.from("card-images").getPublicUrl(path).data.publicUrl };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
