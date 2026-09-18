import { z } from "zod";

// Leadskjema (forside/kontakt) — validert både klient- og serversiden.
// .strict() avviser uventede felter, som krevd i spesifikasjonen.
export const leadSchema = z
  .object({
    name: z.string().min(2, "Navn må være minst 2 tegn").max(100),
    businessName: z.string().min(2, "Virksomhetsnavn må fylles ut").max(150),
    email: z.string().email("Ugyldig e-postadresse"),
    phone: z
      .string()
      .min(8, "Telefonnummer må være minst 8 siffer")
      .max(20)
      .regex(/^[0-9+\s]+$/, "Telefonnummer kan kun inneholde tall, + og mellomrom"),
    businessType: z.string().max(100).optional(),
    employeeCount: z.string().max(50).optional(),
    revenueRange: z.string().max(50).optional(),
    biggestChallenge: z.string().max(500).optional(),
    preferredTime: z.string().max(200).optional(),
    message: z.string().max(1000).optional(),
    consentGiven: z.literal(true, {
      errorMap: () => ({ message: "Du må samtykke til å bli kontaktet" }),
    }),
    // Honeypot-felt for enkel spambeskyttelse — skal alltid være tomt
    website: z.string().max(0).optional(),
  })
  .strict();

export type LeadInput = z.infer<typeof leadSchema>;

// Registrering
export const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
    organizationName: z.string().min(2).max(150),
    email: z.string().email(),
    password: z.string().min(8, "Passord må være minst 8 tegn"),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;

// Innlogging
export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();

// Kartlegging — Del A til F. Alle felter er valgfrie enkeltvis (kunden kan lagre
// utkast og fortsette senere), men skjemaet validerer typer og lengder.
export const assessmentSchema = z
  .object({
    // Del A
    businessType: z.string().max(100).optional(),
    employeeCount: z.coerce.number().int().min(0).max(100000).optional(),
    locationCount: z.coerce.number().int().min(0).max(10000).optional(),
    openingHours: z.string().max(200).optional(),
    region: z.string().max(100).optional(),
    businessModel: z.string().max(300).optional(),

    // Del B
    monthlyRevenue: z.coerce.number().min(0).optional(),
    salesTrend: z.string().max(200).optional(),
    averagePurchase: z.coerce.number().min(0).optional(),
    mainRevenueSource: z.string().max(200).optional(),
    seasonality: z.string().max(300).optional(),

    // Del C
    laborCost: z.coerce.number().min(0).optional(),
    rentCost: z.coerce.number().min(0).optional(),
    goodsCost: z.coerce.number().min(0).optional(),
    electricityCost: z.coerce.number().min(0).optional(),
    transportCost: z.coerce.number().min(0).optional(),
    marketingCost: z.coerce.number().min(0).optional(),
    otherFixedCosts: z.coerce.number().min(0).optional(),

    // Del D
    shrinkage: z.coerce.number().min(0).optional(),
    staffingChallenges: z.string().max(500).optional(),
    sickLeavePercent: z.coerce.number().min(0).max(100).optional(),
    inventoryChallenges: z.string().max(500).optional(),
    purchasingRoutines: z.string().max(500).optional(),
    digitalToolsUsage: z.string().max(500).optional(),

    // Del E
    managerCount: z.coerce.number().int().min(0).max(1000).optional(),
    managementChallenges: z.string().max(500).optional(),
    staffFollowUp: z.string().max(500).optional(),
    training: z.string().max(500).optional(),
    goalManagement: z.string().max(500).optional(),
    meetingRoutines: z.string().max(500).optional(),

    // Del F
    goals90Days: z.string().max(500).optional(),
    desiredImprovement: z.string().max(500).optional(),
    mainObstacle: z.string().max(500).optional(),
    desiredHelp: z.string().max(500).optional(),

    // Om innsendingen er et utkast eller endelig innsending
    submit: z.boolean().default(false),
  })
  .strict();

export type AssessmentInput = z.infer<typeof assessmentSchema>;
