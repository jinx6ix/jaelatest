import type { BasePayload } from 'payload'

/**
 * Sends a plain email to the site contact address when an inquiry arrives.
 * It only works once an email adapter is configured in payload.config.ts (Resend, SMTP...).
 * Without one it does nothing; every inquiry is still saved in the admin under Sales > Inquiries.
 */
export async function notifyInquiry(payload: BasePayload, inquiry: any) {
  try {
    const site: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const to = process.env.INQUIRY_NOTIFY_EMAIL || site?.contactEmail
    if (!to || !payload.email) return
    await payload.sendEmail({
      to,
      subject: `New ${inquiry.type} inquiry from ${inquiry.name}`,
      html: `<p><strong>${inquiry.name}</strong> (${inquiry.email}, ${inquiry.phone})</p><p>Type: ${inquiry.type}<br>Guests: ${inquiry.guests || '-'}<br>Date: ${inquiry.travelDate || '-'}<br>Season: ${inquiry.season || '-'}</p><p>${(inquiry.message || '').replace(/</g, '&lt;')}</p>`,
    })
  } catch (e) {
    payload.logger.warn(`Inquiry notification not sent: ${(e as Error).message}`)
  }
}
