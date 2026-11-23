"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { REMEMBER_COOKIE } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().email("Enter a valid email address.");

function accountPassword(email: string) {
  const secret = process.env.EMAIL_LOGIN_SECRET;
  if (!secret) throw new Error("EMAIL_LOGIN_SECRET is missing.");
  return createHash("sha256").update(`${secret}:${email}`).digest("base64url");
}

async function setRemember() {
  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signUp(formData: FormData) {
  return enterWithEmail(formData);
}

export async function signIn(formData: FormData) {
  return enterWithEmail(formData);
}

export async function requestPasswordReset(_formData?: FormData) {
  return { error: undefined, message: "There is no password. Enter your email to open your cards." };
}

export async function updatePassword(_formData?: FormData) {
  return { error: "There is no password. Enter your email to open your cards.", message: undefined };
}

async function enterWithEmail(formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { error: email.error.issues[0]?.message ?? "Enter a valid email address." };
  if (!isSupabaseConfigured()) {
    return { error: "Add your Supabase keys to .env.local before using email sign-in." };
  }
  if (!process.env.EMAIL_LOGIN_SECRET) {
    return { error: "Email sign-in is not configured on the server." };
  }

  await setRemember();
  const supabase = await createClient();
  const address = email.data.toLowerCase();
  const password = accountPassword(address);
  const fullName = String(formData.get("fullName") || "").trim();

  const { error: prepareError } = await supabase.rpc("prepare_email_login", {
    target_email: address,
    plain_password: password,
  });
  if (prepareError) return { error: prepareError.message };

  const { error: signInError } = await supabase.auth.signInWithPassword({ email: address, password });
  if (signInError) return { error: signInError.message };

  if (fullName) {
    await supabase.auth.updateUser({ data: { display_name: fullName } });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ full_name: fullName, email: address }).eq("id", user.id);
    }
  }

  const next = String(formData.get("next") || "/templates");
  redirect(next.startsWith("/") ? next : "/templates");
}
