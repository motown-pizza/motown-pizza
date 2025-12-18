import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import { Divider, List, ListItem, Stack, Text, Title } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import IntroSection from '@repo/components/layout/intros/section';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function TermsConditions() {
  return (
    <LayoutPage>
      <LayoutSection
        id="page-privacy-policy-content"
        padded
        containerized={'md'}
      >
        <IntroSection
          props={{
            subTitle: 'Privacy',
            title: 'Data Protection & Privacy',
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
              1. Data Collection
            </Title>

            <Text>
              By enrolling in the Program, customers consent to Mo Town Pizza
              collecting and securely storing limited personal information,
              including name, mobile phone number, and email address, for the
              purposes of administering and managing the loyalty program.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              2. No Third-Party Data Sharing
            </Title>

            <Text>
              Mo Town Pizza does not sell, rent, or disclose customer personal
              data to unrelated third parties.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              3. Internal Business Use
            </Title>

            <Text>Customer information may be shared internally within:</Text>

            <List>
              <ListItem>Mo Town Pizza branches</ListItem>
              <ListItem>Affiliated brands</ListItem>
              <ListItem>Sister companies</ListItem>
            </List>

            <Text>
              This is strictly for operational purposes such as order
              processing, customer service, service improvement, and internal
              business analytics.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              4. Marketing & Communications
            </Title>

            <Text>
              By joining the Program, customers consent to receive marketing and
              promotional communications, including:
            </Text>

            <List>
              <ListItem>Product offers</ListItem>
              <ListItem>Discounts and campaigns</ListItem>
              <ListItem>New product launches</ListItem>
              <ListItem>Branch updates</ListItem>
            </List>

            <Text>
              These communications may be delivered via SMS, WhatsApp, email, or
              similar electronic channels by Mo Town Pizza and its affiliated
              brands.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              5. Right to Opt Out of Marketing
            </Title>

            <Text>
              Customers may opt out of receiving marketing messages at any time
              by replying “STOP” to promotional communications or by requesting
              removal through any Mo Town Pizza branch.
            </Text>

            <Text>
              <Text component="span" inherit c={'sec.6'} fw={500}>
                Note
              </Text>
              : Opting out of marketing communications may limit the Program’s
              ability to send point balance updates, reward notifications, and
              free pizza alerts.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              6. Data Security
            </Title>

            <Text>
              Mo Town Pizza commits to applying reasonable technical and
              organizational measures to protect customer data against
              unauthorized access, alteration, loss, or misuse.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              7. Governing Law
            </Title>

            <Text>
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of the Republic of Kenya and any other
              country in which participating Mo Town Pizza branches operate.
            </Text>
          </Stack>
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}
