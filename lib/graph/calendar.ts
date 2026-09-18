import { getGraphAccessToken, getGraphMailbox } from "@/lib/graph/client";

export type CreateCalendarEventInput = {
  subject: string;
  startIso: string; // ISO 8601, f.eks. "2026-09-22T09:00:00"
  endIso: string;
  timeZone?: string; // f.eks. "W. Europe Standard Time"
  attendeeEmail?: string;
  bodyText?: string;
};

// Oppretter en kalenderhendelse i den tilkoblede postboksen (Outlook-kalender).
// Kalles KUN når en administrator eksplisitt bekrefter et tidspunkt for en
// kartleggingssamtale — se app/api/admin/bookings/[id]/confirm/route.ts.
export async function createCalendarEvent(input: CreateCalendarEventInput): Promise<{ id: string }> {
  const accessToken = await getGraphAccessToken();
  const mailbox = getGraphMailbox();
  const timeZone = input.timeZone ?? "W. Europe Standard Time";

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: input.subject,
        start: { dateTime: input.startIso, timeZone },
        end: { dateTime: input.endIso, timeZone },
        body: { contentType: "Text", content: input.bodyText ?? "" },
        attendees: input.attendeeEmail
          ? [{ emailAddress: { address: input.attendeeEmail }, type: "required" }]
          : [],
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Kunne ikke opprette kalenderhendelse (status ${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}

export type GraphMailMessage = {
  id: string;
  subject: string;
  from?: { emailAddress?: { name?: string; address?: string } };
  bodyPreview: string;
  receivedDateTime: string;
  isRead: boolean;
};

// Henter de nyeste meldingene i innboksen — kun lesing, ingen svar sendes herfra.
export async function listRecentInboxMessages(limit = 20): Promise<GraphMailMessage[]> {
  const accessToken = await getGraphAccessToken();
  const mailbox = getGraphMailbox();

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messages` +
      `?$top=${limit}&$orderby=receivedDateTime desc&$select=id,subject,from,bodyPreview,receivedDateTime,isRead`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Kunne ikke hente innboks (status ${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as { value: GraphMailMessage[] };
  return data.value;
}
