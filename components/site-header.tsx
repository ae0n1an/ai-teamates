import { headers } from "next/headers"
import Link from "next/link"

import { SignOutButton } from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"

export async function SiteHeader() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="flex h-14 items-center justify-end gap-2 border-b px-4">
      {session ? (
        <>
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <SignOutButton />
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            Sign in
          </Button>
          <Button nativeButton={false} render={<Link href="/sign-up" />}>
            Sign up
          </Button>
        </>
      )}
    </header>
  )
}
