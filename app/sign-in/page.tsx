import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth-form"
import { auth } from "@/lib/auth"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect("/")

  const { reset } = await searchParams

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-muted p-6">
      <AuthForm
        mode="sign-in"
        notice={
          reset === "success"
            ? "Your password was reset. Sign in with your new password."
            : undefined
        }
      />
    </div>
  )
}
