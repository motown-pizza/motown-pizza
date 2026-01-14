'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Stepper,
  Group,
  StepperStep,
  StepperCompleted,
  Text,
  Stack,
  Progress,
  ThemeIcon,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { useCountdown } from '@/hooks/order';
import { IconCheck } from '@tabler/icons-react';
import IntroSection from '@repo/components/layout/intros/section';

const now = new Date();

export default function OrderTracker() {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  // const prevStep = () =>
  //   setActive((current) => (current > 1 ? current - 1 : current));

  const [targetDate, setTargetDate] = useState<Date>(
    new Date(now.getTime() + 1000 * 60 * 2)
  );

  const { percentElapsed } = useCountdown(targetDate, 2);

  useEffect(() => {
    if (percentElapsed == 100) {
      if (active < 4) {
        nextStep();
        setTargetDate(new Date(new Date().getTime() + 1000 * 60 * 2));
      }
    }
  }, [percentElapsed]);

  return (
    <>
      <Stepper
        active={active}
        // onStepClick={setActive}
        styles={{
          stepDescription: {
            textTransform: 'uppercase',
            fontWeight: 500,
          },
        }}
      >
        <StepperStep label="Phase I" description="Order">
          <Stack align="center" justify="center" py={SECTION_SPACING}>
            <Text ta={'center'}>You&apos;ve placed your order.</Text>
          </Stack>
        </StepperStep>

        <StepperStep label="Phase II" description="Prep">
          <Stack
            gap={'xl'}
            align="center"
            justify="center"
            py={SECTION_SPACING * 2}
          >
            <Progress
              value={percentElapsed}
              striped
              animated
              color="blue"
              w={'66%'}
            />

            <Text ta={'center'}>
              Our chefs are carefully selecting and preparing the freshest
              ingredients for your pizza.
            </Text>
          </Stack>
        </StepperStep>

        <StepperStep label="Phase III" description="Baking">
          <Stack
            gap={'xl'}
            align="center"
            justify="center"
            py={SECTION_SPACING * 2}
          >
            <Progress
              value={percentElapsed}
              striped
              animated
              color="blue"
              w={'66%'}
            />

            <Text ta={'center'}>
              Your pizza is now in the oven, baking to golden perfection.
            </Text>
          </Stack>
        </StepperStep>

        <StepperStep label="Phase III" description="Quality Check">
          <Stack
            gap={'xl'}
            align="center"
            justify="center"
            py={SECTION_SPACING * 2}
          >
            <Progress
              value={percentElapsed || 0}
              striped
              animated
              color="blue"
              w={'66%'}
            />

            <Text ta={'center'}>
              We’re giving your pizza a final quality check to ensure it’s
              perfect before delivery.
            </Text>
          </Stack>
        </StepperStep>

        <StepperCompleted>
          <Stack
            gap={'xl'}
            align="center"
            justify="center"
            py={SECTION_SPACING}
          >
            <Group justify="center">
              <ThemeIcon
                size={ICON_WRAPPER_SIZE * 2}
                color="ter.6"
                radius={999}
              >
                <IconCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>

            <IntroSection
              props={{
                title: 'Order Complete',
                desc: 'Your pizza is ready. You should be receiving it any time now.',
              }}
            />
          </Stack>
        </StepperCompleted>
      </Stepper>
    </>
  );
}
