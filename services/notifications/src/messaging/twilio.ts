'use server';

import { StoreGet } from '@repo/constants';
import { OrderGet } from '@repo/types';
import { capitalizeWords } from '@repo/utils';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendOrderConfirmationWhatsapp(params: {
  order: Omit<OrderGet, 'customerPhone'> & { customerPhone: string };
  total: number;
  store: StoreGet;
  verificationCode?: string | null;
}) {
  // Pre-calculate conditional strings to keep the template clean
  const isCollection = params.order.fulfillmentType === 'COLLECTION';
  const isDelivery = params.order.fulfillmentType === 'DELIVERY';

  const actionVerb = isCollection ? 'Collect' : isDelivery ? 'Delivering' : '';
  const fulfillmentTime = isCollection
    ? 'Avg. wait time: 17 - 21 min'
    : isDelivery
      ? `Avg. delivery time: 17 - 21 min${params.verificationCode ? `\n\nDelivery Pin: ${params.verificationCode}\n\nNote: Don't share the pin with anyone other than the delivery person.` : ''}`
      : '';

  try {
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${params.order.customerPhone}`,
      body: `MoTown Order Confirmed

Order Details:
ID: ${params.order.trackingCode}
Name: ${params.order.customerName.toUpperCase()}

Fulfilment Type: ${capitalizeWords(params.order.fulfillmentType)}
${actionVerb} from: ${params.store.title}
${fulfillmentTime}\n
Total (incl. VAT): Kshs. ${params.total}/-
Payment Method: ${capitalizeWords(params.order.paymentMethod)}

Thank you for ordering with MoTown!`,
      // // Required for production templates
      // contentSid: process.env.TWILIO_TEMPLATE_SID,
    });

    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error('Twilio Error:', error.message);
    return { success: false, error: error.message };
  }
}
