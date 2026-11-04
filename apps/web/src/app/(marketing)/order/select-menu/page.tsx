import React from 'react';
import { Metadata } from 'next';
import { AnchorNextLink, ImageDefault, LayoutSection } from '@repo/ui';
import TabsMenu from '@web/ui/common/tabs/menu';
import AsideOrder from '@web/ui/layout/asides/order';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { LayoutIntroSection } from '@repo/ui';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  images,
  SECTION_SPACING,
} from '@repo/constants';
import { IconCash, IconMoped, IconPhone, IconStar } from '@tabler/icons-react';

export const metadata: Metadata = { title: 'Select Menu' };

export default function SelectMenu() {
  return (
    <div>
      <LayoutSection id="page-select-menu-intro" margined={SECTION_SPACING / 2} mb={0}>
        <Grid
          // mih={`calc(100vh - ${94}px)`}
          // py={'xl'}
          align="end"
        >
          <GridCol span={{ base: 12, md: 6.5 }}>
            <Stack maw={{ md: '80%' }} pb={SECTION_SPACING / 2}>
              <Title order={1} fz={{ md: '2.5rem', xl: '3rem' }} tt={'none'} c={'white'}>
                Two Mediums. One Great Deal.
              </Title>

              <Text>
                Pick any 2 medium pizzas from the classic or chicken menu. Hot at your door in 30 to
                45 minutes.
              </Text>

              <Flex align={{ xs: 'center' }} direction={{ base: 'column', xs: 'row' }} gap={'xs'}>
                <Button>Order Now</Button>

                <Button color="dark" component={AnchorNextLink} href="/loyalty-program">
                  See Loyalty Rewards
                </Button>
              </Flex>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 5.5 }}>
            <Box
              style={{ position: 'relative', overflow: 'hidden' }}
              h={{ base: 240, sm: 280, md: 320 }}
            >
              {/* Floating Badge - Responsive positioning and scaling */}
              <Box
                style={{
                  position: 'absolute',
                  // top: '1rem',
                  // left: '1rem',
                  transform: 'rotate(-15deg)',
                  // zIndex: 2,
                }}
              >
                <Paper radius={999} bg={'sec'} c={'black'} w={'fit-content'} shadow="md">
                  <Stack
                    justify="center"
                    gap={0}
                    w={{ base: 85, sm: 100 }}
                    h={{ base: 85, sm: 100 }}
                    ta={'center'}
                  >
                    <Text inherit fz={{ base: 'xs', sm: 'sm' }} fw={'bold'}>
                      2 Mediums
                    </Text>
                    <Text inherit fz={{ base: 'lg', sm: 'xl' }} fw={900}>
                      <NumberFormatter value={1800} />
                      /-
                    </Text>
                  </Stack>
                </Paper>
              </Box>

              {/* Hero Image - Responsive bottom offset and height */}
              <Box
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-35%', // scales proportionally instead of a fixed negative pixel value
                  right: 0,
                }}
              >
                <ImageDefault
                  src={images.pizza}
                  alt="Menu hero image"
                  height={{ base: 320, sm: 380, md: 440 }}
                  fit="contain"
                />
              </Box>
            </Box>
          </GridCol>
        </Grid>
      </LayoutSection>

      <Divider />

      <LayoutSection id="page-select-menu-conditions" padded={'xs'}>
        <Group>
          {conditions.map((ci, i) => (
            <div key={i}>
              <Group gap={'xs'} fz={'sm'}>
                <ThemeIcon size={ICON_WRAPPER_SIZE} color="dark" c={'sec'}>
                  <ci.icon size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                </ThemeIcon>

                {ci.content}
              </Group>
            </div>
          ))}
        </Group>
      </LayoutSection>

      <Divider />

      <LayoutSection id="page-select-menu-content" containerized={false} mb={SECTION_SPACING}>
        <Grid gap={'xl'}>
          <GridCol span={{ base: 12 }}>
            <TabsMenu options={{ ordering: true }} />
          </GridCol>
        </Grid>
      </LayoutSection>
    </div>
  );
}

const conditions = [
  {
    icon: IconMoped,
    content: (
      <Text inherit>
        <strong>Delivery</strong> in 30 to 45 min
      </Text>
    ),
  },
  {
    icon: IconCash,
    content: (
      <Text inherit>
        <strong>Minimum order</strong> Kshs. 500
      </Text>
    ),
  },
  {
    icon: IconPhone,
    content: (
      <Text inherit>
        Pay with <strong>M-Pesa</strong> or cash
      </Text>
    ),
  },
  {
    icon: IconStar,
    content: (
      <Text inherit>
        Every 12th pizza is <strong>free</strong>
      </Text>
    ),
  },
];
