type EmailRecipient = { email: string; name?: string };

type SendEmailOpts = {
  from: { name: string; email: string };
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
};

export async function sendEmail(opts: SendEmailOpts) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(opts),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `Brevo error ${res.status}`);
  }

  return res.json();
}
