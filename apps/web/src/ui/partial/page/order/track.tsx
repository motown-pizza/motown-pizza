'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import StepperOrderTracker from '@web/ui/common/stepper/order-tracker';
import { Stack } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants';

export default function Track() {
  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <LayoutIntroSection
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
