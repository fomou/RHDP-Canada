import Link from "next/link";
import { Bell, HeartHandshake, ShieldCheck, type LucideIcon } from "lucide-react";
import { HeroArt } from "@/components/hero-art";
import { InquiryForm } from "@/components/inquiry-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { benefits, news, pricing } from "@/lib/content";
import { stripePublishableKeyStatus } from "@/lib/public-config";

const icons: Record<(typeof benefits)[number]["icon"], LucideIcon> = {
  shield: ShieldCheck,
  bell: Bell,
  hands: HeartHandshake,
};

const stripeNotes = {
  missing:
    "Clé publique Stripe absente. Renseignez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
  placeholder: "Clé publique Stripe : placeholder. Aucun paiement en direct.",
  configured: "Clé publique Stripe configurée. Le paiement est créé par l'API.",
};

export default function HomePage() {
  const stripeNote = stripeNotes[stripePublishableKeyStatus()];

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="space-y-6">
          <p className="text-xs font-medium tracking-[0.18em] text-terracotta uppercase">
            Association solidaire · Canada
          </p>
          <h1 className="font-heading text-5xl leading-[1.05] text-forest sm:text-6xl">
            Ensemble, on porte chaque famille.
          </h1>
          <p className="max-w-xl text-lg text-foreground/80">
            Une adhésion simple, des contributions transparentes, et une
            communauté présente dans les moments qui comptent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/#adherer" />}
              className="h-11 rounded-full px-5"
            >
              Devenir membre
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/#contributions" />}
              className="h-11 rounded-full bg-card px-5"
            >
              Comment ça marche
            </Button>
          </div>
        </div>
        <HeroArt />
      </section>

      <section id="contributions" className="bg-muted/70">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-medium tracking-[0.18em] text-terracotta uppercase">
            Tarifs clairs, sans surprise
          </p>
          <h2 className="mt-3 font-heading text-4xl text-forest">
            Ce que vous payez, et quand
          </h2>
          <div
            id="adherer"
            className="mt-8 grid gap-4 md:grid-cols-3"
          >
            {pricing.map((item) => (
              <Card
                key={item.title}
                className={
                  item.tone === "dark"
                    ? "bg-forest text-[#f6f1e7] ring-forest"
                    : "bg-card"
                }
              >
                <CardHeader>
                  <CardTitle
                    className={item.tone === "dark" ? "text-[#f6f1e7]" : undefined}
                  >
                    {item.title}
                  </CardTitle>
                  <CardDescription
                    className={
                      item.tone === "dark" ? "text-[#f6f1e7]/75" : undefined
                    }
                  >
                    {item.detail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-4xl">{item.amount}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Total pour commencer : <span className="font-medium text-foreground">60,00 $</span>.
            Ajouter vos proches n&apos;entraîne aucun frais supplémentaire.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = icons[item.icon];
            return (
              <Card key={item.title}>
                <CardHeader>
                  <Icon aria-hidden className="size-5 text-terracotta" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-4xl text-forest">Actualités récentes</h2>
          <Link href="/actualites" className="text-sm font-medium text-terracotta hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {news.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <p className="text-xs font-medium tracking-[0.16em] text-terracotta uppercase">
                  {item.category}
                </p>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-border/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-[0.18em] text-terracotta uppercase">
              Écrire au secrétariat
            </p>
            <h2 className="font-heading text-4xl text-forest">
              Une question avant d&apos;adhérer ?
            </h2>
            <p className="text-foreground/80">
              Le formulaire vérifie le nom, le courriel et le message. Rien
              n&apos;est envoyé à un serveur.
            </p>
            <p className="text-sm text-muted-foreground">{stripeNote}</p>
          </div>
          <Card>
            <CardContent className="pt-(--card-spacing)">
              <InquiryForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
