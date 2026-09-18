import { DevEmailAdapter, EmailAdapter } from "@/lib/email/adapter";
import { GraphEmailAdapter } from "@/lib/email/graph-adapter";
import { isMicrosoftIntegrationEnabled } from "@/lib/graph/client";

// Egen adaptervelger for GODKJENTE e-postutkast som en administrator aktivt
// trykker "Send" på (se app/api/admin/email-drafts/[id]/send/route.ts).
// Holdt adskilt fra lib/email/adapter.ts (som brukes til systemvarsler som
// leadbekreftelser) for å gjøre det tydelig hvilken kanal som faktisk sender
// ekte, admin-godkjent utadrettet e-post.
export function getOutboundEmailAdapter(): EmailAdapter {
  if (isMicrosoftIntegrationEnabled()) {
    return new GraphEmailAdapter();
  }
  // Microsoft-integrasjonen er ikke koblet til ennå — logg lokalt i stedet for
  // å late som om e-posten er sendt.
  return new DevEmailAdapter();
}
