import { Avatar, Style } from "@dicebear/core"
import definition from "@dicebear/styles/gaze.json"
import Image from "next/image"

import { cn } from "@/lib/utils"

const gaze = new Style(definition)

// The gaze style ships its animation as a component; "none" keeps it still.
const ANIMATION_SPEEDS = [
  "fastest",
  "fast",
  "medium",
  "slow",
  "slowest",
] as const

export function ChatAvatar({
  seed,
  animated = false,
  className,
}: {
  seed: string
  animated?: boolean
  className?: string
}) {
  const src = new Avatar(gaze, {
    seed,
    animationVariant: animated ? ANIMATION_SPEEDS : "none",
  }).toDataUri()

  return (
    <Image
      src={src}
      alt=""
      width={32}
      height={32}
      className={cn("size-8 shrink-0", className)}
    />
  )
}
