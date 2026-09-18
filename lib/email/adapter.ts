// Adaptermønster for e-post. I MVP brukes kun DevEmailAdapter, som logger
// lokalt i stedet for å sende ekte e-post (jf. regel: "ikke send ekte e-poster
// uten godkjenning"). Resend/SendGrid/SMTP/M365-adaptere kobles inn senere
// uten at resten av koden må endres.

export type EmailMessage = {
  to: string;
  subject: string;
  templateKey: EmailTemplateKey;
  data: Record<string, unknown>;
};

export type EmailTemplateKey =
  | "new-lead" // til administrator
  | "contact-received" // bekreftelse til kunde
  | "welcome-portal"
  | "password-reset"
  | "assessment-received"
  | "new-recommendation"
  | "new-message"
  | "booking-confirmation";

export interface EmailAdapter {
  send(message: EmailMessage): Promise<{ success: boolean; id?: string }>;
}

export class DevEmailAdapter implements EmailAdapter {
  async send(message: EmailMessage) {
    // Ingen ekte utsendelse — kun logging, som spesifisert for MVP-fasen.
    // eslint-disable-next-line no-console
    console.log("[DEV EMAIL]", {
      to: message.to,
      subject: message.subject,
      template: message.templateKey,
      data: message.data,
      timestamp: new Date().toISOString(),
    });
    return { success: true, id: `dev-${Date.now()}` };
  }
}

// Bytt ut med RealEmailAdapter (Resend/SMTP/M365) når leverandør er valgt og godkjent.
export const emailAdapter: EmailAdapter = new DevEmailAdapter();

export const emailTemplates: Record<EmailTemplateKey, (data: Record<string, unknown>) => string> = {
  "new-lead": (d) => `Nytt lead: ${d.name} (${d.businessName}) — ${d.email}, ${d.phone}`,
  "contact-received": (d) => `Hei ${d.name}, vi har mottatt din henvendelse og tar kontakt snart.`,
  "welcome-portal": (d) => `Velkommen til kundeportalen, ${d.name}.`,
  "password-reset": () => `Klikk lenken for å tilbakestille passordet ditt.`,
  "assessment-received": (d) => `Kartleggingen for ${d.organizationName} er mottatt.`,
  "new-recommendation": (d) => `En ny anbefaling er lagt til: ${d.title}`,
  "new-message": () => `Du har mottatt en ny melding i kundeportalen.`,
  "booking-confirmation": (d) => `Samtalen din er bekreftet: ${d.preferredTime}`,
};
