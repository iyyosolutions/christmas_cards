"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { REMEMBER_COOKIE } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const password = z.string().min(8, "Use at least 8 characters.");

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(80),
    email: z.string().email("Enter a valid email address."),
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Those passwords do not match.",
    path: ["confirmPassword"],
  });

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password,
});

async function setRemember(remember: boolean) {
  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_COOKIE, remember ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  if (!isSupabaseConfigured()) {
    return { error: "Add your Supabase keys to .env.local before creating accounts." };
  }

  await setRemember(true);
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { display_name: parsed.data.fullName },
    },
  });

  if (error) return { error: error.message };
  if (data.session) redirect("/templates");
  return {
    message: "Check your inbox and open the verification link. You can sign in after your email is confirmed.",
  };
}

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  if (!isSupabaseConfigured()) {
    return { error: "Add your Supabase keys to .env.local before signing in." };
  }

  await setRemember(formData.get("remember") === "on");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: error.message };

  const next = String(formData.get("next") || "/templates");
  redirect(next.startsWith("/") ? next : "/templates");
}

export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Add your Supabase keys to .env.local before resetting a password." };
  }

  const email = z.string().email("Enter a valid email address.").safeParse(formData.get("email"));
  if (!email.success) return { error: email.error.issues[0]?.message ?? "Check the email." };

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: error.message };
  return { message: "If that email has an account, a reset link is on its way." };
}

const newPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Those passwords do not match.",
  });

export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Add your Supabase keys to .env.local before choosing a new password." };
  }

  const parsed = newPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Open the reset link from your email, then choose a new password." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  redirect("/templates");
}
