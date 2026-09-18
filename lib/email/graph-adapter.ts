import { EmailAdapter, EmailMessage } from "@/lib/email/adapter";
import { getGraphAccessToken, getGraphMailbox } from "@/lib/graph/client";

// Sender e-post via Microsoft Graph (POST /users/{mailbox}/sendMail).
// Brukes KUN når en administrator eksplisitt trykker "Send" på et allerede
// godkjent utkast — se app/api/admin/email-drafts/[id]/send/route.ts.
// Denne klassen sender aldri noe av seg selv; den er bare transportlaget.
export class GraphEmailAdapter implements EmailAdapter {
  async send(message: EmailMessage): Promise<{ success: boolean; id?: string }> {
    const accessToken = await getGraphAccessToken();
    const mailbox = getGraphMailbox();

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: message.subject,
            body: {
              contentType: "Text",
              content: String(message.data.body ?? ""),
            },
            toRecipients: [{ emailAddress: { address: message.to } }],
          },
          saveToSentItems: true,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`Microsoft Graph avviste sendingen (status ${res.status}): ${errorText}`);
    }

    return { success: true };
  }
}
