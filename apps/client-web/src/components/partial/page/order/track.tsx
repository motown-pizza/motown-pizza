'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import IntroSection from '@repo/components/layout/intros/section';
import { useStoreOrderDetails } from '@/libraries/zustand/stores/order-details';
import { useStoreVariant } from '@/libraries/zustand/stores/variant';
import StepperOrderTracker from '@/components/common/stepper/order-tracker';
import { Stack } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Track() {
  const { orderDetails } = useStoreOrderDetails();
  const { variants } = useStoreVariant();

  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <IntroSection
        props={{
          title: 'Track Order',
          desc: 'Keep track of how your Order situation is developing',
        }}
      />

      <Stack mt={SECTION_SPACING}>
        <StepperOrderTracker />
      </Stack>
    </LayoutSection>
  );
}
