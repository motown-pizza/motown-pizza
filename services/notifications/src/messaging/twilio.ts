'use server';

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

interface SendSMSParams {
  toPhone: string;
  orderId: string;
  total: number;
}

export async function sendOrderConfirmationWhatsapp({ toPhone, orderId, total }: SendSMSParams) {
  // Clean phone number input
  const cleanDigits = toPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanDigits.startsWith('254')
    ? `+${cleanDigits}`
    : `+254${cleanDigits.replace(/^0/, '')}`;

  try {
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${formattedPhone}`,
      body: `Order Placed \nID: ${orderId} \nTotal: Kshs. ${total}/- \nThank you for ordering with MoTown!`,
      // // Required for production templates
      // contentSid: process.env.TWILIO_TEMPLATE_SID,
    });

    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error('Twilio Error:', error.message);
    return { success: false, error: error.message };
  }
}
