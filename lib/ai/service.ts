// KI-serviceabstraksjon (§12). Deaktivert som standard i MVP.
// Når dette kobles til en ekte leverandør (Anthropic API), skal reglene under
// fortsatt gjelde og håndheves i implementasjonen:
//
// - Skal ikke gi juridiske, skattemessige eller autoritative regnskapsråd
// - Skal ikke finne på tall — kun bruke faktiske data fra kundens egen organisasjon
// - Skal opplyse tydelig når informasjon mangler
// - Skal aldri bruke én kundes data i en annen kundes svar
// - Alle svar skal kunne spores til grunnlaget (hvilken Assessment/Metric de bygger på)
// - Tydelig ansvarsfraskrivelse skal vises sammen med ethvert KI-generert innhold

export const AI_FEATURES_ENABLED = false; // sentral av/på-bryter

export type AiRequestContext = {
  organizationId: string;
  assessmentId?: string;
};

export interface AiService {
  summarizeAssessment(ctx: AiRequestContext): Promise<string>;
}

class DisabledAiService implements AiService {
  async summarizeAssessment(): Promise<string> {
    throw new Error(
      "KI-funksjoner er ikke aktivert i denne versjonen. Sett AI_FEATURES_ENABLED til true og koble til en leverandør før bruk."
    );
  }
}

// Byttes ut med en ekte implementasjon (Anthropic API) når personvern,
// kostnad og kvalitet er avklart og godkjent.
export const aiService: AiService = new DisabledAiService();
