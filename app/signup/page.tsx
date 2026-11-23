import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 py-4 md:grid-cols-2 md:gap-10 md:py-16">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">Join the list</p>
        <h1 className="mt-3 font-serif text-4xl text-pine-deep sm:text-5xl">An account, then a card.</h1>
        <p className="mt-4 text-ink/70">
          Enter your email and continue. We store it, and every card you make stays on that address.
        </p>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
