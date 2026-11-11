export function HeroArt() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#c9844a] shadow-[0_18px_50px_-28px_rgba(28,61,50,0.7)]">
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-label="Illustration d'une tablée familiale au soleil d'automne"
        className="h-full w-full"
      >
        <rect width="640" height="420" fill="#d98a45" />
        <circle cx="520" cy="70" r="54" fill="#f2c14e" />
        <path d="M0 250c80-50 140-20 210-40s140-10 200 20 150 10 230-30v220H0Z" fill="#6e8a45" />
        <path d="M40 300c70 20 120-10 190 8 80 20 120-16 200 6 50 14 90 8 150-10v116H40Z" fill="#2f5a32" />
        <rect x="150" y="214" width="340" height="18" rx="8" fill="#8a4b28" />
        <rect x="168" y="232" width="16" height="70" fill="#6d3b22" />
        <rect x="456" y="232" width="16" height="70" fill="#6d3b22" />
        <circle cx="210" cy="168" r="28" fill="#e0a070" />
        <circle cx="320" cy="156" r="30" fill="#c9845a" />
        <circle cx="430" cy="170" r="26" fill="#8d5a3c" />
        <path d="M176 196c18 28 46 40 70 36 8-18 6-40-8-54-28 0-52 6-62 18Z" fill="#1c3d32" />
        <path d="M286 188c16 36 52 48 84 36 6-22-2-46-18-58-30 2-54 8-66 22Z" fill="#143028" />
        <path d="M398 194c14 26 40 36 66 28 4-16-2-36-14-48-24 2-42 8-52 20Z" fill="#7a3e28" />
        <ellipse cx="250" cy="210" rx="22" ry="10" fill="#f3d7a1" />
        <ellipse cx="360" cy="208" rx="26" ry="11" fill="#f6e2b8" />
        <ellipse cx="455" cy="214" rx="18" ry="8" fill="#e7b56a" />
      </svg>
      <div className="absolute right-4 bottom-4 rounded-2xl bg-card/95 px-4 py-3 text-card-foreground shadow-sm">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Remis aux familles en 2026
        </p>
        <p className="font-heading text-2xl text-forest">9 220,00 $</p>
      </div>
    </div>
  );
}
