import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialOrderCheckoutReview from '@/components/partial/page/order/checkout-review';

export const metadata: Metadata = { title: 'Review Checkout' };

export default function CheckoutReview() {
  return (
    <LayoutPage>
      <PartialOrderCheckoutReview />
    </LayoutPage>
  );
}
