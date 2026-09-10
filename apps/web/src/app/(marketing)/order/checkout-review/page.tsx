import React from 'react';
import { Metadata } from 'next';
import PartialOrderCheckoutReview from '@web/ui/partial/page/order/checkout-review';

export const metadata: Metadata = { title: 'Review Checkout' };

export default function CheckoutReview() {
  return (
    <div>
      <PartialOrderCheckoutReview />
    </div>
  );
}
