"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function AuthForm({
  mode,
  nextPath = "/cards",
}: {
  mode: "signin" | "signup";
  nextPath?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setMessage(null);
    const result = mode === "signup" ? await signUp(formData) : await signIn(formData);
    if (result?.error) setError(result.error);
    if (result && "message" in result && result.message) setMessage(result.message);
    setPending(false);
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-[28px] border border-ink/10 bg-cream/90 p-6 shadow-sm">
      {mode === "signup" && (
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </div>
      {mode === "signup" && (
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
        </div>
      )}
      {mode === "signin" && (
        <>
          <input type="hidden" name="next" value={nextPath} />
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="remember" defaultChecked className="size-4 accent-[#143028]" />
            Remember me on this device
          </label>
        </>
      )}
      {error && <p className="text-sm text-berry">{error}</p>}
      {message && <p className="text-sm text-pine">{message}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-ink/60">
        {mode === "signup" ? (
          <Link href="/login" className="underline">
            Already have an account
          </Link>
        ) : (
          <span className="flex flex-col gap-2">
            <Link href="/forgot-password" className="underline">
              Forgot password
            </Link>
            <Link href="/signup" className="underline">
              Need an account
            </Link>
          </span>
        )}
      </p>
    </form>
  );
}
