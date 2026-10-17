"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { botInsertSchema, type BotInsertInput } from "@/lib/validations/bot"

type CreateBotResult =
  | { success: true; botId: string }
  | {
      success: false
      error: string
      fieldErrors?: Partial<Record<keyof BotInsertInput, string[]>>
    }

export async function createBot(
  input: BotInsertInput
): Promise<CreateBotResult> {
  // Server Actions are reachable by direct POST, so authenticate here too.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { success: false, error: "You need to be signed in." }

  const parsed = botInsertSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    }
  }

  const { instructions, ...data } = parsed.data
  const bot = await prisma.bot.create({
    data: {
      ...data,
      instructions: instructions || null,
      userId: session.user.id,
    },
    select: { id: true },
  })

  revalidatePath("/")
  return { success: true, botId: bot.id }
}
