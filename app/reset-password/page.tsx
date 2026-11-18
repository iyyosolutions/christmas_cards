import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">New password</p>
        <h1 className="mt-3 font-serif text-5xl text-pine-deep">Choose a password you will remember.</h1>
        <p className="mt-4 text-ink/70">This replaces the old one. You stay signed in afterwards.</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
