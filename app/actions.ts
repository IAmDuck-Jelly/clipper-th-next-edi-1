'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    phone: z.string().min(1, 'Phone is required').max(20),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required').max(2000),
});

function generateRecommendedReply(name: string, message: string): string {
    const lower = message.toLowerCase();
    const hasGreeting = /hello|hi|hey|good\s*(morning|afternoon|evening)/i.test(lower);
    const isQuestion = /\?|what|how|when|where|can you|could you|do you/i.test(lower);
    const hasUrgent = /urgent|asap|immediately|emergency|fast/i.test(lower);
    const hasPrice = /price|cost|how much|quotation|quote|budget/i.test(lower);
    const hasDelivery = /deliver|ship|receive|track|order status|when will/i.test(lower);
    const hasComplaint = /problem|issue|broken|damage|not working|complaint|disappointed/i.test(lower);

    let tone = '';
    let body = '';
    let closing = '';

    if (hasComplaint) {
        tone = `Dear ${name},`;
        body = `Thank you for bringing this to our attention. We sincerely apologize for the inconvenience you've experienced. Your feedback is important to us, and we want to make this right.`;
        closing = `We'd like to look into this further. Could you please provide us with your order number or any additional details? Our team will prioritize your case and get back to you within 24 hours.`;
    } else if (hasPrice) {
        tone = `Dear ${name},`;
        body = `Thank you for your interest in our products! We'd be happy to provide you with pricing information.`;
        closing = `Our sales team will prepare a detailed quotation for you and send it to your email within 24 hours. If you have specific products or quantities in mind, please let us know so we can provide the most accurate pricing.`;
    } else if (hasDelivery) {
        tone = `Dear ${name},`;
        body = `Thank you for reaching out! We understand you'd like an update on your delivery.`;
        closing = `Our logistics team will check the status and get back to you shortly. You can also track your order through the link sent to your email upon dispatch.`;
    } else if (hasUrgent) {
        tone = `Dear ${name},`;
        body = `We've received your urgent request and understand the time sensitivity.`;
        closing = `Our team is already looking into this and will respond within 2-4 hours. For immediate assistance, you can also reach us at our hotline.`;
    } else if (isQuestion) {
        tone = `Dear ${name},`;
        body = `Thank you for your inquiry! We're happy to help answer your question.`;
        closing = `Our team is reviewing your message and will provide a detailed response within 24 hours. If you need immediate assistance, please don't hesitate to call us.`;
    } else {
        tone = `Dear ${name},`;
        body = `Thank you for contacting Clipper Thailand! We've received your message and appreciate you reaching out to us.`;
        closing = `Our team will review your message and get back to you within 24 hours. We look forward to assisting you!`;
    }

    return `${tone}\n\n${body}\n\n${closing}`;
}

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

    const recommendedReply = generateRecommendedReply(name, message);

    const embed = {
        title: '📩 New Contact Form Submission',
        color: 0x5865f2,
        fields: [
            { name: '👤 Name', value: name, inline: true },
            { name: '📧 Email', value: email, inline: true },
            { name: '📱 Phone', value: phone, inline: true },
            { name: '💬 Message', value: message.length > 1024 ? message.slice(0, 1021) + '...' : message },
            { name: '✅ Recommended Reply', value: recommendedReply.length > 1024 ? recommendedReply.slice(0, 1021) + '...' : recommendedReply },
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
