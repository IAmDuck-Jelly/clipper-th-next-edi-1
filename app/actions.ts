'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    phone: z.string().min(1, 'Phone is required').max(20),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required').max(2000),
});

async function sendConfirmationEmail(to: string, name: string, message: string) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
        from: 'Clipper Thailand <noreply@clipperthailand.com>',
        to,
        subject: 'We Received Your Inquiry - Clipper Thailand',
        html: `
            <div style="margin: 0; padding: 0; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                                <tr>
                                    <td style="background-color: #FFD700; padding: 32px 40px; text-align: center;">
                                        <img src="https://clipperthailand.com/images/clipper-logo.png" alt="Clipper Thailand" width="200" style="display: block; margin: 0 auto 12px;" />
                                        <p style="margin: 0; font-size: 13px; color: #333; letter-spacing: 2px; text-transform: uppercase;">Official Distributor</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px 40px 20px;">
                                        <h1 style="margin: 0 0 8px; font-size: 26px; color: #1a1a1a; font-family: Arial, sans-serif;">Thank you, ${name}!</h1>
                                        <p style="margin: 0; font-size: 15px; color: #666; font-family: Arial, sans-serif;">We appreciate you reaching out to us.</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 40px 24px;">
                                        <div style="border-top: 2px solid #FFD700; width: 60px;"></div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 40px 24px;">
                                        <p style="margin: 0 0 12px; font-size: 15px; color: #333; line-height: 1.6; font-family: Arial, sans-serif;">
                                            We've received your inquiry and our team is reviewing it carefully.
                                        </p>
                                        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; font-family: Arial, sans-serif;">
                                            We will get back to you within <strong style="color: #1a1a1a;">24 hours</strong>.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 40px 32px;">
                                        <div style="background-color: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
                                            <p style="margin: 0 0 8px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Your Message</p>
                                            <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; font-family: Arial, sans-serif;">${message}</p>
                                        </div>
                                    </td>
                                </tr>



                                <tr>
                                    <td style="background-color: #1a1a1a; padding: 24px 40px; text-align: center;">
                                        <p style="margin: 0 0 4px; font-size: 13px; color: #FFD700; font-family: Arial, sans-serif; letter-spacing: 1px;">CLIPPER THAILAND</p>
                                        <p style="margin: 0; font-size: 12px; color: #888; font-family: Arial, sans-serif;">
                                            <a href="https://clipperthailand.com" style="color: #FFD700; text-decoration: none;">clipperthailand.com</a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        `,
    });
}

export async function submitContactForm(data: { name: string; phone: string; email: string; message: string }) {
    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
        const errorMessage = parsed.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errorMessage };
    }

    const { name, phone, email, message } = parsed.data;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL!;

    const embed = {
        title: '📩 New Contact Form Submission',
        color: 0x5865f2,
        fields: [
            { name: '👤 Name', value: name, inline: true },
            { name: '📧 Email', value: email, inline: true },
            { name: '📱 Phone', value: phone, inline: true },
            { name: '💬 Message', value: message.length > 1024 ? message.slice(0, 1021) + '...' : message },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Clipper Thailand Contact Form' },
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `Discord responded with ${response.status}: ${errorText}` };
        }

        sendConfirmationEmail(email, name, message).catch(err =>
            console.error('Email send failed (non-blocking):', err)
        );

        return { success: true };
    } catch (error) {
        console.error('Contact form submission error:', error);
        return { success: false, error: 'Failed to send message.' };
    }
}
