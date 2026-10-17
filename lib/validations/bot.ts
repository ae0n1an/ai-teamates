import { z } from "zod"

import type { Prisma } from "@/lib/generated/prisma/client"

// Fields a user may set when creating a bot. `userId` comes from the session,
// and `id`, `sandboxId` and the timestamps are owned by the server.
type BotInsert = Omit<
  Prisma.BotUncheckedCreateInput,
  "id" | "userId" | "sandboxId" | "createdAt" | "updatedAt"
>

// `satisfies` (the prisma-client replacement for `Prisma.validator`) fails the
// build if this schema drifts from the Bot model in prisma/schema.prisma.
export const botInsertSchema = z.object({
  name: z.string().trim().min(1, "Give your bot a name.").max(50),
  avatar: z.string().min(1),
  job: z.string().trim().min(1, "Give your bot a job.").max(80),
  instructions: z.string().trim().max(2000),
}) satisfies z.ZodType<BotInsert>

export type BotInsertInput = z.infer<typeof botInsertSchema>
