import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicApiUrl } from "@/lib/public-config";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Exemple de formulaire de connexion, validé dans le navigateur.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-14">
      <p className="text-xs font-medium tracking-[0.18em] text-terracotta uppercase">
        Connexion
      </p>
      <h1 className="mt-3 font-heading text-4xl text-forest">Espace membre</h1>
      <p className="mt-3 text-foreground/80">
        Saisissez votre courriel et votre mot de passe. Cette page vérifie les
        champs et n&apos;ouvre pas de session.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Identifiants</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm apiUrl={publicApiUrl()} />
        </CardContent>
      </Card>
    </div>
  );
}
