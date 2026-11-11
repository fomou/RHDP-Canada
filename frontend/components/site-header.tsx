import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/actualites", label: "Actualités" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-background">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded-full focus:bg-card focus:px-3 focus:py-2"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-primary font-heading text-sm text-primary-foreground">
            R
          </span>
          <span className="font-heading text-lg tracking-tight text-forest">
            RHDP Canada
          </span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-start gap-x-5 gap-y-2 text-sm md:justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/connexion" className="text-sm hover:text-foreground">
            Connexion
          </Link>
          <Button
            nativeButton={false}
            render={<Link href="/#adherer" />}
            className="h-10 rounded-full px-4"
          >
            Adhérer · 60,00 $
          </Button>
        </div>
      </div>
    </header>
  );
}
