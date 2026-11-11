import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { news } from "@/lib/content";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Vie associative, solidarité et antennes de RHDP Canada.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-medium tracking-[0.18em] text-terracotta uppercase">
        Actualités
      </p>
      <h1 className="mt-3 font-heading text-5xl text-forest">La vie de l&apos;association</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
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
    </div>
  );
}
