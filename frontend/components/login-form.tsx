"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  courriel: z.string().trim().pipe(z.email("Indiquez un courriel valide.")),
  motDePasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({ apiUrl }: { apiUrl: string }) {
  const [accepted, setAccepted] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { courriel: "", motDePasse: "" },
  });

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={form.handleSubmit(() => setAccepted(true))}
      onChange={() => setAccepted(false)}
    >
      <div className="grid gap-2">
        <Label htmlFor="login-courriel">Courriel</Label>
        <Input
          id="login-courriel"
          type="email"
          autoComplete="username"
          className="h-11 bg-card"
          aria-invalid={Boolean(form.formState.errors.courriel)}
          {...form.register("courriel")}
        />
        {form.formState.errors.courriel ? (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.courriel.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="login-password">Mot de passe</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className="h-11 bg-card"
          aria-invalid={Boolean(form.formState.errors.motDePasse)}
          {...form.register("motDePasse")}
        />
        {form.formState.errors.motDePasse ? (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.motDePasse.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="h-11 rounded-full px-5">
        Vérifier la connexion
      </Button>
      {accepted ? (
        <p role="status" className="text-sm text-forest">
          Champs valides. Cette page n&apos;appelle pas le serveur. L&apos;API
          attend <span className="font-medium">POST {apiUrl}/api/auth/login</span>.
        </p>
      ) : null}
    </form>
  );
}
