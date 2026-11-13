'use client';

import React from 'react';
import { Badge, Box, Card, Flex, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCheck, IconFlame } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';

const steps = [
  { label: 'Order received', desc: 'We have your order and payment', time: '7:42 pm', status: 'done' },
  { label: 'Being made', desc: 'Your pizza is being topped', time: '7:46 pm', status: 'done' },
  { label: 'In the oven', desc: 'Baking now. Almost ready!', time: '7:54 pm', status: 'active' },
  { label: 'On the way', desc: 'Your rider heads out as soon as it is boxed', time: 'Next', status: 'pending' },
  { label: 'Delivered', desc: 'Enjoy your meal', time: '', status: 'pending' },
];

export default function OrderTracker() {
  return (
    <Card bg="var(--mantine-color-dark-8)" withBorder p="xl" radius="lg">
      <Flex justify="space-between" mb="xl">
        <Stack gap={0}>
          <Text c="dimmed" fz="sm">Estimated arrival</Text>
          <Title order={2} c="white" fz="2rem">About 25 minutes</Title>
        </Stack>
        <Badge color="green" variant="light" size="lg" radius="sm">On schedule</Badge>
      </Flex>

      <Stack gap={0}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const color = step.status === 'done' ? 'green' : step.status === 'active' ? 'red' : 'dark.4';
          const Icon = step.status === 'done' ? IconCheck : step.status === 'active' ? IconFlame : null;

          return (
            <Flex key={step.label} align="flex-start" wrap="nowrap">
              <Stack align="center" gap={0}>
                <ThemeIcon color={color} size={ICON_WRAPPER_SIZE} radius="xl">
                  {Icon ? <Icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} /> : null}
                </ThemeIcon>
                {!isLast && (
                  <Box w={2} h={50} bg={step.status === 'done' ? 'green' : 'var(--mantine-color-dark-6)'} my={4} />
                )}
              </Stack>
              <Stack gap={0} ml="md">
                <Text fw={600} c="white">{step.label}</Text>
                <Text fz="sm" c="dimmed">{step.desc}</Text>
                <Text fz="xs" c="dimmed" mt={4}>{step.time}</Text>
              </Stack>
            </Flex>
          );
        })}
      </Stack>
    </Card>
  );
}
