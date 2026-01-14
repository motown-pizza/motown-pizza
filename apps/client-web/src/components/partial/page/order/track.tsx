'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import IntroSection from '@repo/components/layout/intros/section';
import StepperOrderTracker from '@/components/common/stepper/order-tracker';
import { Stack } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Track() {
  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <IntroSection
        props={{
          title: 'Track Order',
          desc: 'Keep track of how your order sequence is developing',
        }}
      />

      <Stack mt={SECTION_SPACING}>
        <StepperOrderTracker />
      </Stack>
    </LayoutSection>
  );
}
