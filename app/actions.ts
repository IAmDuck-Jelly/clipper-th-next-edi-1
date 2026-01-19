'use server';

export async function submitContactForm(data: { name: string; phone: string; email: string; message: string }) {
    console.log('Server Action [submitContactForm] started with:', data);
    const webhookUrl = 'https://n8n.mashedup.online/webhook/2305da1f-872e-472d-9670-a6dabc52da6d';

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `Server responded with ${response.status}: ${errorText}` };
        }

        return { success: true };
    } catch (error) {
        console.error('Contact form submission error:', error);
        return { success: false, error: 'Failed to connect to the server.' };
    }
}
