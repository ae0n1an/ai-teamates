type Email = {
  to: string
  subject: string
  text: string
}

// Development stub: logs emails to the server console.
// Replace with a real provider (e.g. Resend) before production.
export async function sendEmail({ to, subject, text }: Email) {
  console.log(`\n[email] To: ${to}\n[email] Subject: ${subject}\n${text}\n`)
}
