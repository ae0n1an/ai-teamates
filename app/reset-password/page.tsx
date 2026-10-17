import { ResetPasswordForm } from "@/components/reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>
}) {
  // Better Auth redirects here with ?token=... or ?error=INVALID_TOKEN.
  const { token, error } = await searchParams

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-muted p-6">
      <ResetPasswordForm token={error ? null : (token ?? null)} />
    </div>
  )
}
