import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import {
  Button,
  Card,
  Divider,
  Flex,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import ModalLoyaltyProgram from '@web/ui/common/modal/loyalty-program';
import { IconCheck } from '@tabler/icons-react';
import { AccordionFaq } from '@repo/ui';
import { faqLoyalty } from '@web/data/faq';
import { LayoutIntroSection } from '@repo/ui';
import PartialLoyalty from '@web/ui/partial/page/loyalty';

export const metadata: Metadata = { title: 'Loyalty Program' };

export default function LoyaltyProgram() {
  return (
    <div>
      <PartialLoyalty />

      <LayoutSection id="page-loyalty-program-content" margined containerized={'md'}>
        <Stack mt={SECTION_SPACING}>
          <Card
            padding={0}
            p={{ base: 'md', xs: 'xl' }}
            py={{ base: 'xl' }}
            bg={'dark.9'}
            withBorder
            c={'white'}
          >
            <Flex
              direction={{ base: 'column', xs: 'row' }}
              align={'center'}
              justify={{ xs: 'space-between' }}
              gap={{ base: 'xl' }}
            >
              <Stack gap={'xl'}>
                <Title order={3} fz={'xl'} ta={{ base: 'center', xs: 'start' }}>
                  Start Earning Today
                </Title>

                <Stack gap={'xs'}>
                  <Group>
                    <ThemeIcon size={ICON_WRAPPER_SIZE - 4} color="sec" c={'pri'}>
                      <IconCheck size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ThemeIcon>

                    <Text component="span" inherit>
                      Order your favourite pizza.
                    </Text>
                  </Group>

                  <Group>
                    <ThemeIcon size={ICON_WRAPPER_SIZE - 4} color="sec" c={'pri'}>
                      <IconCheck size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ThemeIcon>

                    <Text component="span" inherit>
                      Collect points.
                    </Text>
                  </Group>

                  <Group>
                    <ThemeIcon size={ICON_WRAPPER_SIZE - 4} color="sec" c={'pri'}>
                      <IconCheck size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ThemeIcon>

                    <Text component="span" inherit>
                      Enjoy free rewards.
                    </Text>
                  </Group>
                </Stack>
              </Stack>

              <Group justify="center" mt={'md'}>
                <ModalLoyaltyProgram>
                  <Button size="md">Join Program</Button>
                </ModalLoyaltyProgram>
              </Group>
            </Flex>

            <Text fz={'sm'} ta={'center'} mt={'xl'}>
              MoTown Pizza – Every Slice Gets You Closer
            </Text>

            <Text fz={'sm'} ta={'center'} mt={'md'}>
              MoTown Pizza may update the loyalty program from time to time to keep it fair for
              everyone.
            </Text>
          </Card>
        </Stack>
      </LayoutSection>
    </div>
  );
}
