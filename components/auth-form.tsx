"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function AuthForm({
  mode,
  nextPath = "/templates",
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
          <Input id="fullName" name="fullName" autoComplete="name" placeholder="Ada Lovelace" />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <input type="hidden" name="next" value={nextPath} />
      {error && <p className="text-sm text-berry">{error}</p>}
      {message && <p className="text-sm text-pine">{message}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : "Continue"}
      </Button>
      <p className="text-center text-sm text-ink/60">
        {mode === "signup" ? (
          <Link href="/login" className="underline">
            Already used this email
          </Link>
        ) : (
          <Link href="/signup" className="underline">
            First time here
          </Link>
        )}
      </p>
    </form>
  );
}
