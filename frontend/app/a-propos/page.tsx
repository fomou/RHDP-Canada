import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questions } from "@/lib/content";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "RHDP Canada rassemble les familles d'ici autour d'une idée simple : personne ne traverse seul les grands moments de la vie.",
};

const values = [
  {
    title: "Solidarité",
    body: "Chaque contribution va directement à la famille concernée.",
  },
  {
    title: "Transparence",
    body: "Montants, échéances et bilans sont visibles par tous les membres.",
  },
  {
    title: "Simplicité",
    body: "Un parcours pensé pour tous, quel que soit votre aisance numérique.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-medium tracking-[0.18em] text-terracotta uppercase">
        À propos
      </p>
      <h1 className="mt-3 max-w-3xl font-heading text-5xl leading-tight text-forest">
        Une diaspora qui se serre les coudes
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-foreground/80">
        RHDP Canada rassemble les familles d&apos;ici autour d&apos;une idée
        simple : personne ne traverse seul les grands moments de la vie.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title}>
            <CardHeader>
              <CardTitle>{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{value.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-16 max-w-2xl">
        <h2 className="text-center font-heading text-4xl text-forest">
          Questions fréquentes
        </h2>
        <Accordion className="mt-8">
          {questions.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
