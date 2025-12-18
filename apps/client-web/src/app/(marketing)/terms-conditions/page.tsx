import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import { Divider, List, ListItem, Stack, Text, Title } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import IntroSection from '@repo/components/layout/intros/section';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsConditions() {
  return (
    <LayoutPage>
      <LayoutSection
        id="page-terms-conditions-content"
        padded
        containerized={'md'}
      >
        <IntroSection
          props={{
            subTitle: 'Usage',
            title: 'Terms & Conditions',
          }}
        />

        <Stack mt={SECTION_SPACING} gap={'xl'}>
          <div>
            <Divider my={'md'} />

            <Text ta={'center'} fz={'sm'} fw={500}>
              Last Updated: 12 Dec, 2025
            </Text>

            <Divider my={'md'} />
          </div>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              1. Eligibility & Enrollment
            </Title>

            <Text>
              The Mo Town Pizza Slice Points Loyalty Program (“the Program”) is
              open to all customers who register by providing their name, valid
              mobile phone number and an Email Address. Participation in the
              Program is free and completely voluntary.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              2. Earning Slice Points
            </Title>

            <Text>
              Customers earn one (1) Slice Point for every qualifying pizza
              purchased at any participating Mo Town Pizza branch. Transactions
              that are cancelled, refunded, reversed, or found to be fraudulent
              do not qualify for points.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              3. Point Categories by Pizza Size
            </Title>

            <Text>Slice Points are issued strictly based on pizza size:</Text>

            <List>
              <ListItem>Small</ListItem>
              <ListItem>Medium</ListItem>
              <ListItem>Large</ListItem>
              <ListItem>Long Play (Extra Large)</ListItem>
            </List>

            <Text>
              Points earned in one size category cannot be combined, merged,
              exchanged, or transferred to another size category.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              4. Reward Threshold
            </Title>

            <Text>
              A reward is unlocked when a customer accumulates twelve (12) Slice
              Points within the same size category. Earned rewards are
              automatically recorded in the customer’s loyalty account.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              5. Reward Redemption Rules
            </Title>

            <Text>
              Free pizzas must be redeemed in the same size category as the
              points earned. Rewards apply only to standard menu pizzas and are
              subject to product availability at the time of redemption.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              6. Motown Meltdown – Special Rules
            </Title>

            <Text>
              “Motown Meltdown” pizzas earn separate loyalty points and are
              eligible only in:
            </Text>

            <List>
              <ListItem>Medium</ListItem>
              <ListItem>Large</ListItem>
            </List>

            <Text>
              A free Motown Meltdown pizza may only be redeemed after collecting
              twelve (12) Motown Meltdown points and cannot be exchanged for
              other pizza types.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              7. Extras & Upgrades
            </Title>

            <Text>
              Loyalty rewards cover the base pizza only. Any premium toppings,
              stuffed crust upgrades, specialty sauces, or additional extras
              will be charged separately.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              8. Points Expiry
            </Title>

            <Text>
              Slice Points will expire after six (6) months of account
              inactivity. Expired points are forfeited and cannot be reinstated.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              9. No Cash Value
            </Title>

            <Text>
              Rewards have no monetary or cash value and cannot be exchanged,
              refunded, or redeemed for cash or credit.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              10. Account Rules
            </Title>

            <Text>
              Each customer is permitted to maintain only one (1) loyalty
              account per mobile phone number. Points are non-transferable and
              may not be sold, gifted, or shared.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              11. Amendments, Suspension & Termination
            </Title>

            <Text>
              Mo Town Pizza reserves the right to amend, modify, suspend, or
              terminate the Program, including its rules, structure, rewards, or
              benefits, at any time without prior notice where reasonably
              required for operational, legal, or business reasons.
            </Text>
          </Stack>
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}
