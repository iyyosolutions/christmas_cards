import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">Join the list</p>
        <h1 className="mt-3 font-serif text-5xl text-pine-deep">An account, then a card.</h1>
        <p className="mt-4 text-ink/70">
          We send a confirmation email through Supabase. After you verify, your cards stay in one place.
        </p>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
