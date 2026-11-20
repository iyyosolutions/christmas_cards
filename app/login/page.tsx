import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-berry">Welcome back</p>
        <h1 className="mt-3 font-serif text-5xl text-pine-deep">Sign in to your cards.</h1>
        <p className="mt-4 text-ink/70">
          Use the email and password you confirmed. New accounts stay closed until the verification email is opened.
        </p>
        {params.error === "confirm" && (
          <p className="mt-4 text-sm text-berry">That confirmation link could not be completed. Request a new one by signing up again, or try signing in.</p>
        )}
      </div>
      <AuthForm mode="signin" nextPath={params.next || "/templates"} />
    </div>
  );
}
