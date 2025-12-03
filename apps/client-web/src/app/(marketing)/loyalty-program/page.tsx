import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import { Button, Group, Stack, Text } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import IntroPage from '@repo/components/layout/intros/page';
import ModalLoyaltyProgram from '@/components/common/modal/loyalty-program';

export const metadata: Metadata = { title: 'Loyalty Program' };

export default function LoyaltyProgram() {
  return (
    <LayoutPage>
      <LayoutSection
        id="page-loyalty-program-content"
        padded
        containerized={'md'}
      >
        <IntroPage
          props={{
            title: 'Loyalty Program',
            desc: 'Join now to start earning points for great rewards.',
          }}
        />

        <Stack align="center" mt={SECTION_SPACING}>
          <Text ta={'center'} fz={24} c={'sec'} fw={500}>
            FREE PIZZA IS A CLICK AWAY!
          </Text>

          <Text ta={'center'}>
            MOTOWN Loyalty program is a reward program when you spent a certain
            amount of money or purchase a particular Item at any of MOTOWN
            participating store, you earn a point.
          </Text>

          <Group justify="center" mt={'md'}>
            <ModalLoyaltyProgram>
              <Button size="md">Join Program</Button>
            </ModalLoyaltyProgram>
          </Group>
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}
