"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ShuffleIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { createBot } from "@/lib/actions/bot"
import { botInsertSchema, type BotInsertInput } from "@/lib/validations/bot"

const TEMPLATES = [
  {
    name: "Ada",
    job: "Research assistant",
    instructions:
      "Answer briefly, cite sources, and ask before running anything destructive.",
  },
  {
    name: "Linus",
    job: "Code reviewer",
    instructions:
      "Look for bugs first and style second. Suggest concrete fixes and explain why.",
  },
  {
    name: "Strunk",
    job: "Writing editor",
    instructions:
      "Tighten the prose, keep the author's voice, and flag anything unclear instead of guessing.",
  },
  {
    name: "Socrates",
    job: "Tutor",
    instructions:
      "Teach by asking questions. Check understanding before moving on and never just hand over answers.",
  },
] as const

const FORM_ID = "bot-form"

export function BotDialog({ children }: { children: React.ReactElement }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New bot</DialogTitle>
          <DialogDescription>
            Give it a face, a name, and a job to do.
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so every open starts with a fresh form and face. */}
        <BotForm onCreated={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function BotForm({ onCreated }: { onCreated: () => void }) {
  const form = useForm<BotInsertInput>({
    resolver: zodResolver(botInsertSchema),
    defaultValues: {
      name: "",
      avatar: crypto.randomUUID(),
      job: "",
      instructions: "",
    },
  })
  const avatar = useWatch({ control: form.control, name: "avatar" })
  const { isSubmitting } = form.formState

  async function onSubmit(values: BotInsertInput) {
    const result = await createBot(values)

    if (!result.success) {
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof BotInsertInput, { message: messages?.[0] })
      }
      toast.add({ type: "error", title: result.error })
      return
    }

    toast.add({ type: "success", title: `${values.name} is ready to chat` })
    onCreated()
  }

  return (
    <>
      <form
        id={FORM_ID}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((template) => (
            <Button
              key={template.job}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                form.reset({ ...template, avatar: form.getValues("avatar") })
              }
            >
              {template.job}
            </Button>
          ))}
        </div>

        <Item size="sm" className="px-0">
          <ItemMedia variant="image">
            <ChatAvatar seed={avatar} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Face</ItemTitle>
            <ItemDescription>Shuffle until you find one you like.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setValue("avatar", crypto.randomUUID())}
            >
              <ShuffleIcon data-icon="inline-start" />
              Shuffle
            </Button>
          </ItemActions>
        </Item>

        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bot-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="bot-name"
                  placeholder="Ada"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="job"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bot-job">Job</FieldLabel>
                <Input
                  {...field}
                  id="bot-job"
                  placeholder="Research assistant"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="instructions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bot-instructions">
                  How it should work
                </FieldLabel>
                <Textarea
                  {...field}
                  id="bot-instructions"
                  placeholder="Answer briefly, cite sources, and ask before running anything destructive."
                  className="min-h-24"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Create bot
        </Button>
      </DialogFooter>
    </>
  )
}
