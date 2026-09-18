'use server';

import { StoreGet } from '@repo/constants';
// Example usage inside an API Route or Server Action
import { sendOrderConfirmationWhatsapp } from '@repo/notifications';
import { OrderGet } from '@repo/types';

export async function handleOrderNotification(params: {
  order: OrderGet;
  total: number;
  store: StoreGet;
  verificationCode?: string | null;
}) {
  if (!params.order.customerPhone) return;

  // Clean phone number input
  const cleanDigits = params.order.customerPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanDigits.startsWith('254')
    ? `+${cleanDigits}`
    : `+254${cleanDigits.replace(/^0/, '')}`;

  const result = await sendOrderConfirmationWhatsapp({
    ...params,
    order: { ...params.order, customerPhone: formattedPhone },
  });

  if (!result.success) {
    console.log('Failed to send SMS notification:', result.error);
  }
}
