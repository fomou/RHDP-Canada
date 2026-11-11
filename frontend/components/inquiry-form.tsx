"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inquirySchema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom (2 caractères au moins)."),
  courriel: z.string().trim().pipe(z.email("Indiquez un courriel valide.")),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères."),
});

type InquiryValues = z.infer<typeof inquirySchema>;

export function InquiryForm() {
  const [accepted, setAccepted] = useState(false);
  const form = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { nom: "", courriel: "", message: "" },
  });

  function onSubmit() {
    setAccepted(true);
  }

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      onChange={() => setAccepted(false)}
    >
      <Field
        id="nom"
        label="Nom"
        error={form.formState.errors.nom?.message}
        invalid={Boolean(form.formState.errors.nom)}
      >
        <Input
          id="nom"
          autoComplete="name"
          className="h-11 bg-card"
          aria-invalid={Boolean(form.formState.errors.nom)}
          {...form.register("nom")}
        />
      </Field>
      <Field
        id="courriel"
        label="Courriel"
        error={form.formState.errors.courriel?.message}
        invalid={Boolean(form.formState.errors.courriel)}
      >
        <Input
          id="courriel"
          type="email"
          autoComplete="email"
          className="h-11 bg-card"
          aria-invalid={Boolean(form.formState.errors.courriel)}
          {...form.register("courriel")}
        />
      </Field>
      <Field
        id="message"
        label="Message"
        error={form.formState.errors.message?.message}
        invalid={Boolean(form.formState.errors.message)}
      >
        <textarea
          id="message"
          rows={4}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          aria-invalid={Boolean(form.formState.errors.message)}
          {...form.register("message")}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" className="h-11 rounded-full px-5">
          Vérifier le message
        </Button>
        {accepted ? (
          <p role="status" className="text-sm text-forest">
            Champs valides. Cette ébauche ne transmet pas le message.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  invalid,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  invalid: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {invalid && error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
