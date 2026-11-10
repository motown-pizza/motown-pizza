'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { LayoutIntroSection } from '@repo/ui';
import StepperOrderTracker from '@web/ui/common/stepper/order-tracker';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants';
import { IconMapPin, IconPhone } from '@tabler/icons-react';

export default function Track() {
  return (
    <LayoutSection id="page-checkout-review-content" padded>
      <LayoutIntroSection
        props={{
          title: 'Track Order',
          desc: 'Keep track of how your order sequence is developing',
        }}
      />

      <Grid mt={SECTION_SPACING}>
        <GridCol span={{ base: 12, md: 7 }}>
          <StepperOrderTracker />
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <Card
              bg="var(--mantine-color-dark-8)"
              withBorder
              p="xl"
              h={250}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Stack align="center" gap="xs">
                <IconMapPin size={32} color="var(--mantine-color-dimmed)" />
                <Text c="dimmed" fz="sm">
                  Map view coming soon
                </Text>
              </Stack>
            </Card>

            <Card bg="var(--mantine-color-dark-8)" withBorder p="lg">
              <Group justify="space-between">
                <Group>
                  <Avatar color="red" radius="xl">
                    R
                  </Avatar>
                  <Stack gap={0}>
                    <Text fw={600} c="white">
                      Your rider
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Assigned once your pizza is boxed
                    </Text>
                  </Stack>
                </Group>
                <Button variant="default" leftSection={<IconPhone size={16} />}>
                  Call
                </Button>
              </Group>

              <Divider my="md" />

              <Text fw={600} c="white" mb="sm">
                Order MT-1042
              </Text>

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fz="sm" c="dimmed">
                    Meaty MoTown, Large
                  </Text>
                  <Text fz="sm" c="white">
                    1,200
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fz="sm" c="dimmed">
                    1 x Fries
                  </Text>
                  <Text fz="sm" c="white">
                    200
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fz="sm" c="dimmed">
                    Delivery
                  </Text>
                  <Text fz="sm" c="white">
                    150
                  </Text>
                </Group>
              </Stack>

              <Divider my="md" />

              <Group justify="space-between">
                <Text fw={600} c="white">
                  Total paid
                </Text>
                <Text fw={600} c="white">
                  Kshs. 1,550
                </Text>
              </Group>
            </Card>
          </Stack>
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}
