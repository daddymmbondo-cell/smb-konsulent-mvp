// Sentral prissetting. Endre priser her — det oppdaterer automatisk prissiden.
// Plassholdere til reelle priser er satt ("[PRIS_...]") slik at ingen falske
// tall vises før du har fylt dem inn.

export type PricingPackage = {
  slug: string;
  title: string;
  price: string; // plassholder-streng inntil reell pris er satt
  description: string;
  included: string[];
  ctaLabel: string;
};

export const pricingPackages: PricingPackage[] = [
  {
    slug: "startanalyse",
    title: "Startanalyse",
    price: "[PRIS_STARTANALYSE]",
    description: "En første gjennomgang av virksomhetens nøkkeltall og forbedringsmuligheter.",
    included: [
      "Kartleggingssamtale",
      "Digital kartlegging i kundeportalen",
      "Rapport med tre prioriterte tiltak",
    ],
    ctaLabel: "Bestill startanalyse",
  },
  {
    slug: "forbedringsprosjekt",
    title: "Forbedringsprosjekt",
    price: "[PRIS_FORBEDRINGSPROSJEKT]",
    description: "Et avgrenset prosjekt der vi jobber sammen om ett eller flere konkrete forbedringsområder.",
    included: [
      "Alt i Startanalyse",
      "Tett oppfølging gjennom prosjektperioden",
      "Konkret handlingsplan med målbare steg",
    ],
    ctaLabel: "Diskuter et prosjekt",
  },
  {
    slug: "fast-manedlig-oppfolging",
    title: "Fast månedlig oppfølging",
    price: "[PRIS_MÅNEDLIG_OPPFØLGING]",
    description: "Løpende rådgivning og oppfølging for virksomheter som ønsker kontinuerlig forbedring.",
    included: [
      "Alt i Forbedringsprosjekt",
      "Månedlig gjennomgang av nøkkeltall",
      "Løpende tilgjengelighet for spørsmål",
    ],
    ctaLabel: "Snakk om fast oppfølging",
  },
];
