import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth-form"
import { auth } from "@/lib/auth"

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect("/")

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-muted p-6">
      <AuthForm mode="sign-up" />
    </div>
  )
}
