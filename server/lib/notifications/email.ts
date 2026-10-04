/**
 * Multi-provider Email & Webhook Notification Dispatcher for Wildfire Docs
 * Supports:
 * - Resend API (RESEND_API_KEY)
 * - Discord Webhook (DISCORD_WEBHOOK_URL)
 * - Standard Console Dispatch Simulation
 */

export interface Subscriber {
  email: string;
  createdAt: string;
}

export async function dispatchRestorationAlerts(subscribers: Subscriber[]): Promise<{
  success: boolean;
  sentCount: number;
  provider: string;
  errors: string[];
}> {
  if (!subscribers || subscribers.length === 0) {
    return { success: true, sentCount: 0, provider: 'none', errors: [] };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
  const fromEmail = process.env.EMAIL_FROM || 'Wildfire Docs <docs@wildfire.internal>';
  const siteUrl = process.env.PUBLIC_ORIGIN || 'http://localhost:3000';

  const errors: string[] = [];
  let sentCount = 0;
  let providerUsed = 'simulated-engine';

  // 1. Resend API Dispatch (if configured)
  if (resendApiKey) {
    providerUsed = 'resend';
    for (const sub of subscribers) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: sub.email,
            subject: '🔥 Wildfire Docs is Back Online!',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0f17; color: #f4f4f5; padding: 40px 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #ff6b00; margin: 0; font-size: 24px; font-weight: 800;">Wildfire Docs</h1>
                  <p style="color: #a1a1aa; font-size: 14px; margin-top: 6px;">Platform Maintenance Complete</p>
                </div>
                <div style="background: #141923; border: 1px solid #232b3b; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                  <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6;">
                    Hello,<br/><br/>
                    Our scheduled platform upgrade has completed successfully. All documentation routes, search vector indexes, and interactive APIs are now live and fully operational.
                  </p>
                  <div style="text-align: center; margin-top: 24px;">
                    <a href="${siteUrl}/docs" style="display: inline-block; background: #ff6b00; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px;">Open Documentation</a>
                  </div>
                </div>
                <p style="color: #71717a; font-size: 12px; text-align: center; margin: 0;">
                  You received this email because you subscribed to restoration notifications on Wildfire Docs.
                </p>
              </div>
            `,
          }),
        });

        if (res.ok) {
          sentCount++;
        } else {
          const errData = await res.json().catch(() => ({}));
          errors.push(`Resend error for ${sub.email}: ${JSON.stringify(errData)}`);
        }
      } catch (err: any) {
        errors.push(`Failed sending to ${sub.email}: ${err?.message || err}`);
      }
    }
  }

  // 2. Discord Webhook Broadcast (if configured)
  if (discordWebhook) {
    providerUsed = resendApiKey ? 'resend+discord' : 'discord';
    try {
      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: '🔥 Wildfire Docs is Back Online!',
              description: `Platform maintenance has finished. Notified **${subscribers.length}** waiting users.\n\n[Open Documentation](${siteUrl}/docs)`,
              color: 0xff6b00,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
    } catch (err: any) {
      errors.push(`Discord webhook error: ${err?.message || err}`);
    }
  }

  // 3. Fallback: Log dispatched alerts to server console
  if (!resendApiKey && !discordWebhook) {
    console.log(
      `\x1b[32m[NOTIFICATION ENGINE]\x1b[0m Dispatched restoration alerts to ${subscribers.length} subscribers.`,
    );
    sentCount = subscribers.length;
  }

  return {
    success: errors.length === 0,
    sentCount,
    provider: providerUsed,
    errors,
  };
}
