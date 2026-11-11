import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-[#f6f1e7]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-primary font-heading text-sm text-primary-foreground">
              R
            </span>
            <span className="font-heading text-lg">RHDP Canada</span>
          </div>
          <p className="max-w-xs text-sm text-[#f6f1e7]/75">
            Une communauté solidaire qui se tient debout ensemble, d&apos;un
            océan à l&apos;autre.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Contact</p>
          <p>
            <a className="hover:underline" href="mailto:contact@rhdp-canada.ca">
              contact@rhdp-canada.ca
            </a>
          </p>
          <p className="text-[#f6f1e7]/75">Montréal · Toronto · Ottawa</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Le site</p>
          <Link className="block hover:underline" href="/#adherer">
            Adhérer
          </Link>
          <Link className="block hover:underline" href="/a-propos">
            À propos
          </Link>
          <Link className="block hover:underline" href="/connexion">
            Connexion
          </Link>
        </div>
      </div>
    </footer>
  );
}
