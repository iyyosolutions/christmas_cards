import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">Password reset</p>
        <h1 className="mt-3 font-serif text-5xl text-pine-deep">We can send a fresh link.</h1>
        <p className="mt-4 text-ink/70">
          Enter the email on your account. The message includes a link that lets you choose a new password.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
