'use server';

// Example usage inside an API Route or Server Action
import { sendOrderConfirmationWhatsapp } from '@repo/notifications';

export async function handleOrderNotification(customerPhone: string, orderId: string) {
  const result = await sendOrderConfirmationWhatsapp({
    // toPhone: customerPhone, // Must be your verified caller ID while using Trial
    toPhone: customerPhone,
    orderId: orderId,
  });

  if (!result.success) {
    console.log('Failed to send SMS notification:', result.error);
  }
}
