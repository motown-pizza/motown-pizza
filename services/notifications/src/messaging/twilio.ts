'use server';

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

interface SendSMSParams {
  toPhone: string;
  orderId: string;
}

export async function sendOrderConfirmationWhatsapp({ toPhone, orderId }: SendSMSParams) {
  // Clean phone number input
  const cleanDigits = toPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanDigits.startsWith('254')
    ? `+${cleanDigits}`
    : `+254${cleanDigits.replace(/^0/, '')}`;

  try {
    const message = await client.messages.create({
      body: `Order Confirmation (${orderId}): Thank you for ordering with MoTown!`,
      // Standard Twilio WhatsApp Sandbox Number
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${formattedPhone}`,
    });

    console.log(`WhatsApp Message Sent! SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error('Twilio Error:', error.message);
    return { success: false, error: error.message };
  }
}
