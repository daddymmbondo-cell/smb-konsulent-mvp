-- Rapporteringsvisninger for Power BI.
-- Disse er bevisst "flate" og lesbare — Power BI kobler seg mot disse i stedet
-- for å modellere de normaliserte Prisma-tabellene direkte, slik at rapportbygging
-- blir enklere og mer stabil selv om databasestrukturen endres senere internt.
--
-- Kjør denne migrasjonen med: npx prisma migrate dev --name add_reporting_views
-- (Prisma migrerer skjemaet, men denne SQL-filen må kjøres i tillegg —
-- se docs/power-bi-oppsett.md for fremgangsmåte.)

-- Leads: status, kilde og tidslinje
CREATE OR REPLACE VIEW vw_leads_rapport AS
SELECT
  l.id,
  l.name AS kontaktperson,
  l."businessName" AS virksomhet,
  l."businessType" AS bransje,
  l.status,
  l."createdAt" AS mottatt_dato,
  b."confirmedTime" AS bekreftet_samtale_tid,
  CASE WHEN b."confirmedTime" IS NOT NULL THEN true ELSE false END AS har_bekreftet_samtale
FROM "Lead" l
LEFT JOIN "Booking" b ON b."leadId" = l.id;

-- Kartlegginger og nøkkeltall, én rad per nøkkeltall (lang/tidy format — enkelt å pivotere i Power BI)
CREATE OR REPLACE VIEW vw_kartlegging_nokkeltall AS
SELECT
  a.id AS kartlegging_id,
  o.id AS organisasjon_id,
  o.name AS virksomhet,
  a.status,
  a."submittedAt" AS innsendt_dato,
  m.key AS nokkeltall,
  m.value AS verdi,
  m."isEstimate" AS er_estimat
FROM "Assessment" a
JOIN "Organization" o ON o.id = a."organizationId"
LEFT JOIN "Metric" m ON m."assessmentId" = a.id;

-- Anbefalinger — hvilke tiltak som oftest foreslås (nyttig for å se mønstre på tvers av kunder)
CREATE OR REPLACE VIEW vw_anbefalinger_rapport AS
SELECT
  r.id,
  o.name AS virksomhet,
  r.title AS tiltak,
  r.priority AS prioritet,
  a."submittedAt" AS kartlegging_dato
FROM "Recommendation" r
JOIN "Assessment" a ON a.id = r."assessmentId"
JOIN "Organization" o ON o.id = a."organizationId";

-- Kundeemner fra Enhetsregisteret — funnel-oversikt
CREATE OR REPLACE VIEW vw_kundeemner_rapport AS
SELECT
  sl.id,
  sl.name AS virksomhet,
  sl."naceDescription" AS bransje,
  sl.municipality AS kommune,
  sl.status,
  sl."createdAt" AS foreslatt_dato,
  sl."reviewedAt" AS vurdert_dato
FROM "SuggestedLead" sl;

-- E-postutkast — hvor mange som genereres, godkjennes og faktisk sendes
CREATE OR REPLACE VIEW vw_epost_rapport AS
SELECT
  ed.id,
  ed.purpose AS formal,
  ed.status,
  ed."createdAt" AS opprettet_dato,
  ed."approvedAt" AS godkjent_dato,
  ed."sentAt" AS sendt_dato
FROM "EmailDraft" ed;
