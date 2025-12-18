import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
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
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import ModalLoyaltyProgram from '@/components/common/modal/loyalty-program';
import { IconCheck } from '@tabler/icons-react';
import AccordionFaq from '@/components/common/accordions/faq';
import { faqLoyalty } from '@/data/faq';
import IntroSection from '@repo/components/layout/intros/section';

export const metadata: Metadata = { title: 'Loyalty Program' };

export default function LoyaltyProgram() {
  return (
    <LayoutPage>
      <LayoutSection
        id="page-loyalty-program-content"
        padded
        containerized={'md'}
      >
        <IntroSection
          props={{
            subTitle: 'Loyalty Program',
            title: 'Slice Points Loyalty Program',
            desc: 'Love pizza? Get rewarded for it.',
          }}
        />

        <Stack mt={SECTION_SPACING} gap={'xl'}>
          <Text>
            The Mo Town Slice Points Loyalty Program lets you earn points every
            time you buy a pizza and turn those points into FREE pizza.
          </Text>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              How To Join
            </Title>

            <Text>Joining is simple and free:</Text>

            <List>
              <ListItem>
                Order at any Mo Town Pizza store or onListItemne
              </ListItem>
              <ListItem>Give us your name, phone number and Email</ListItem>
              <ListItem>
                You’re automatically registered and start earning points
                immediately
              </ListItem>
            </List>

            <Text>No complicated forms. No hidden costs.</Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              How You Earn Points
            </Title>

            <Text>You earn 1 point for every pizza you buy.</Text>

            <Text>Points are tracked by pizza size:</Text>

            <List>
              <ListItem>Small Pizza → Small Points</ListItem>
              <ListItem>Medium Pizza → Medium Points</ListItem>
              <ListItem>Large Pizza → Large Points</ListItem>
              <ListItem>Long Play (Extra Large) → XL Points</ListItem>
            </List>

            <Text>Points from different sizes cannot be mixed.</Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              How the Free Pizza Works
            </Title>

            <Text>
              Collect 12 points of the same size and you’ll receive:{' '}
              <Text component="span" inherit fw={'bold'} c={'ter.6'}>
                1 FREE pizza of that same size
              </Text>
              .
            </Text>

            <Text>
              Example:{' '}
              <Text component="span" inherit fw={'bold'} c={'sec.6'}>
                12 Medium pizza points = 1 FREE Medium pizza
              </Text>
              .
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              Motown Meltdown (Signature Pizza)
            </Title>

            <Text>
              Because of its special cheese-filled crust, the Motown Meltdown
              has its own loyalty system:
            </Text>

            <List>
              <ListItem>Available in Medium and Large only</ListItem>
              <ListItem>Earns separate Meltdown points</ListItem>
              <ListItem>
                Requires 12 Meltdown points to earn a FREE Meltdown pizza
              </ListItem>
            </List>

            <Text>Points from different sizes cannot be mixed.</Text>
          </Stack>

          <Divider my={SECTION_SPACING} />

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              Simple Terms & Conditions
            </Title>

            <Text>We believe in keeping things clear:</Text>

            <List>
              <ListItem>One point per pizza purchased</ListItem>
              <ListItem>Points are separated by size</ListItem>
              <ListItem>12 points = 1 free pizza of the same size</ListItem>
              <ListItem>Points expire after 6 months of no activity</ListItem>
              <ListItem>
                Free pizzas come from the standard loyalty menu
              </ListItem>
              <ListItem>
                Extras like additional toppings, extra cheese, or stuffed crust
                upgrades will be charged
              </ListItem>
              <ListItem>
                Points cannot be transferred or exchanged for cash
              </ListItem>
              <ListItem>One account per phone number</ListItem>
            </List>

            <Text>
              Mo Town Pizza may update the loyalty program from time to time to
              keep it fair for everyone.
            </Text>
          </Stack>
        </Stack>

        <Stack mt={SECTION_SPACING}>
          <Card
            padding={0}
            p={{ base: 'md', xs: 'xl' }}
            py={{ base: 'xl' }}
            bg={'ter.7'}
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
                    <ThemeIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      color="sec.6"
                      c={'pri.6'}
                    >
                      <IconCheck
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ThemeIcon>

                    <Text component="span" inherit>
                      Order your favourite pizza.
                    </Text>
                  </Group>

                  <Group>
                    <ThemeIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      color="sec.6"
                      c={'pri.6'}
                    >
                      <IconCheck
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ThemeIcon>

                    <Text component="span" inherit>
                      Collect points.
                    </Text>
                  </Group>

                  <Group>
                    <ThemeIcon
                      size={ICON_WRAPPER_SIZE - 4}
                      color="sec.6"
                      c={'pri.6'}
                    >
                      <IconCheck
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                      />
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

            <Text fz={'sm'} ta={'center'} mt={'md'}>
              Mo Town Pizza – Every Slice Gets You Closer
            </Text>
          </Card>
        </Stack>
      </LayoutSection>

      <LayoutSection id="page-loyalty-program-faq" padded containerized={'md'}>
        <IntroSection
          props={{
            subTitle: "FAQ's",
            title: 'Slice Points Loyalty Program – FAQs',
          }}
        />

        <Stack mt={'xl'}>
          <AccordionFaq props={{ items: faqLoyalty }} />
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}
