'use client';

import React, { useEffect, useState } from 'react';
import { AccordionFaq, AnchorNextLink, LayoutSection, WrapperUnderlayBlur } from '@repo/ui';
import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  List,
  ListItem,
  Overlay,
  Progress,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCheck, IconPhone, IconPizzaFilled, IconStar } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import ModalLoyaltyProgram from '@web/ui/common/modal/loyalty-program';
import { faqLoyalty } from '@web/data/faq';
import { useElementSize, useMediaQuery } from '@mantine/hooks';
import { capitalizeWord, capitalizeWords, validators } from '@repo/utils';
import { useStoreOrder, useStoreOrderItem, useStoreProductVariant } from '@repo/store';
import { OrderGet, OrderStatus, Size, Variant } from '@repo/types';
import { useNotification } from '@repo/notifications';

export default function PartialLoyalty() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const phoneIsValid = !validators.phone(phoneNumber);
  const { showNotification } = useNotification();

  const { orders } = useStoreOrder();
  const { orderItems } = useStoreOrderItem();

  const [filteredOrders, setFilteredOrders] = useState<OrderGet[] | null>(null);

  const handleFilterOrders = () => {
    if (!phoneIsValid) {
      showNotification({
        variant: Variant.FAILED,
        title: 'Invalid Phone Number',
        desc: 'The number entered is not valid.',
      });

      if (filteredOrders?.length) {
        setFilteredOrders(null);
      }

      return;
    }

    const foundOrders = (orders || []).filter(
      (oi) => oi.customerPhone == phoneNumber.trim() && oi.status != 'DRAFT',
    );

    if (!foundOrders.length) {
      showNotification({
        variant: Variant.FAILED,
        title: 'No Orders Found',
        desc: `No orders have been placed with ${phoneNumber.trim()}.`,
      });

      if (filteredOrders?.length) {
        setFilteredOrders(null);
      }

      return;
    }

    if (filteredOrders && filteredOrders[0].customerPhone == phoneNumber.trim()) {
      showNotification({
        variant: Variant.FAILED,
        title: 'Already Shown',
        desc: 'Your points are being displayed.',
      });

      return;
    }

    setFilteredOrders(foundOrders);
    setPizzaSize(null);
  };

  const currentOrderItems = orderItems?.filter((oi) =>
    filteredOrders?.map((oi2) => oi2.id).includes(oi.orderId),
  );
  const { productVariants } = useStoreProductVariant();
  const currentVariants = productVariants?.filter((vi) =>
    currentOrderItems?.map((ci) => ci.productVariantId).includes(vi.id),
  );

  let pizzaSizes = [
    {
      title: Size.SMALL,
      desc: `${THRESHOLD} small pizzas earn 1 free small pizza.`,
      timesPurchased: 2, // supposed to match the number of order items that contain the same variant size
      progress: Math.floor((2 / THRESHOLD) * 100),
    },
    {
      title: Size.MEDIUM,
      desc: `${THRESHOLD} medium pizzas earn 1 free medium pizza.`,
      timesPurchased: 4, // supposed to match the number of order items that contain the same variant size
      progress: Math.floor((4 / THRESHOLD) * 100),
    },
    {
      title: Size.LARGE,
      desc: `${THRESHOLD} large pizzas earn 1 free large pizza.`,
      timesPurchased: 10, // supposed to match the number of order items that contain the same variant size
      progress: Math.floor((10 / THRESHOLD) * 100),
    },
    {
      title: Size.EXTRALARGE,
      desc: `${THRESHOLD} xl pizzas earn 1 free xl pizza.`,
      timesPurchased: 12, // supposed to match the number of order items that contain the same variant size
      progress: Math.floor((12 / THRESHOLD) * 100),
    },
    {
      title: 'MoTown Meltdown',
      desc: `${THRESHOLD} Meltdown pizzas earn 1 free Meltdown pizza.`,
      timesPurchased: 6, // supposed to match the number of order items that contain the same variant size
      progress: Math.floor((6 / THRESHOLD) * 100),
    },
  ];

  pizzaSizes = pizzaSizes.map((pizzaSize) => {
    // Calculate how many times this specific size or specialty pizza was purchased
    const timesPurchased =
      currentOrderItems?.reduce((total, oi) => {
        const variant = currentVariants?.find((vi) => vi.id == oi.productVariantId);

        // Check if the entry matches either variant.size (e.g., Size.SMALL)
        // or variant.title (e.g., 'MoTown Meltdown')
        const matches =
          variant && (variant.size === pizzaSize?.title || variant.title === pizzaSize?.title);

        if (matches) {
          // Use oi.quantity if your order items have a quantity property, otherwise default to 1
          const quantity = oi.quantity ?? 1;
          return total + quantity;
        }
        return total;
      }, 0) ?? 0;

    // Calculate progress percentage (capped at 100% just in case)
    const progress = Math.min(100, Math.floor((timesPurchased / THRESHOLD) * 100));

    return {
      ...pizzaSize,
      timesPurchased,
      progress,
    };
  });

  const [pizzaSize, setPizzaSize] = useState<(typeof pizzaSizes)[0] | null>(pizzaSizes[2]);

  const desktop = useMediaQuery('(min-width: 62em)');

  return (
    <Box>
      <LayoutSection id="page-loyalty-program-intro" margined={SECTION_SPACING}>
        <Stack gap={SECTION_SPACING / 2}>
          <Grid
            // mih={`calc(100vh - ${94}px)`}
            // py={'xl'}
            align="center"
          >
            <GridCol span={{ base: 12, md: 6.5 }}>
              <Stack maw={{ md: '80%' }}>
                <Title order={1} fz={{ base: '1.5rem', xl: '3rem' }} tt={'none'} c={'white'}>
                  Collect 12 Points.
                  <br /> Get 1 Free Pizza.
                </Title>

                <Text>
                  Every pizza you buy earns you 1 point for its size. When you have 12 points of the
                  same size, your next pizza of that size is on us.
                </Text>

                <Flex align={{ md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={'xs'}>
                  <TextInput
                    w={{ md: '60%' }}
                    aria-label={'Phone Number'}
                    placeholder={`Phone Number`}
                    size="md"
                    variant="default"
                    leftSection={<IconPhone size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.currentTarget.value)}
                    styles={{
                      section: {
                        color: 'var(--mantine-color-sec-6)',
                      },
                      input: {
                        // borderColor: 'var(--mantine-color-sec-6)',
                        borderWidth: 2,
                      },
                    }}
                  />

                  <Button
                    w={{ md: '40%' }}
                    size="md"
                    onClick={handleFilterOrders}
                    disabled={
                      !!(filteredOrders && filteredOrders[0].customerPhone == phoneNumber.trim())
                    }
                  >
                    Check my points
                  </Button>
                </Flex>

                <Text c={'dimmed'} fz={'sm'} mt={'md'}>
                  New to the loyalty program? Order online or visit any store and provide your name
                  and phone number, or{' '}
                  <AnchorNextLink href="#" inherit c={'sec'} fw={500}>
                    <ModalLoyaltyProgram>join online</ModalLoyaltyProgram>
                  </AnchorNextLink>
                  .
                </Text>
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 5.5 }}>
              <Stack>
                <CardLoyalty phone={phoneNumber} pizzaSize={pizzaSize} orders={filteredOrders} />
              </Stack>
            </GridCol>
          </Grid>

          <ScrollArea w={'100%'} scrollbars={'x'} pb={'xs'}>
            <Group wrap="nowrap" grow>
              {pizzaSizes.map((ps) => {
                const active = ps.title == pizzaSize?.title;

                return (
                  <Card
                    px={{ base: 'xs', xs: 'md' }}
                    py={{ base: 5, xs: 'md' }}
                    miw={!desktop ? 'fit-content' : undefined}
                    // maw={{ base: undefined, md: `${(1 / pizzaSizes.length) * 100}%` }}
                    key={ps.title}
                    bg={'var(--mantine-color-dark-9)'}
                    withBorder
                    onClick={() => setPizzaSize(ps)}
                    style={{
                      opacity: !filteredOrders?.length ? 0.8 : 1,
                      borderWidth: 2,
                      color: !filteredOrders?.length ? 'var(--mantine-color-dark-6)' : undefined,
                      borderColor: active ? 'var(--mantine-color-ter-6)' : undefined,
                      backgroundColor: !filteredOrders?.length
                        ? undefined
                        : active
                          ? 'var(--mantine-color-ter-light)'
                          : 'var(--mantine-color-dark-9)',
                      transition: 'all 0.2s ease-in-out',
                      cursor: filteredOrders?.length ? 'pointer' : undefined,
                    }}
                  >
                    <Stack gap={'xs'}>
                      <Title order={3} fz={{ base: 'xs', xs: 'sm' }}>
                        {capitalizeWords(ps.title)}
                      </Title>

                      <Text
                        fz={'xs'}
                        c={!filteredOrders?.length ? undefined : active ? undefined : 'dimmed'}
                        visibleFrom="xs"
                        mih={37.2}
                      >
                        {ps.desc}
                      </Text>

                      <Progress
                        value={ps.progress}
                        color={!filteredOrders?.length ? 'dark' : ps.progress > 70 ? 'ter' : 'sec'}
                        size={'sm'}
                        visibleFrom="xs"
                      />
                    </Stack>
                  </Card>
                );
              })}
            </Group>
          </ScrollArea>
        </Stack>
      </LayoutSection>

      <LayoutSection id="page-loyalty-program-intro" margined={SECTION_SPACING}>
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Stack>
              <Title order={2} fz={'lg'} c={'sec'}>
                How to Join
              </Title>

              <List listStyleType="none" spacing={'xs'}>
                {howToJoin.map((lii, i) => (
                  <ListItem key={lii}>
                    <Group wrap="nowrap" align="start" gap={'xs'}>
                      <ThemeIcon size={ICON_WRAPPER_SIZE - 4} fz={'sm'} fw={'bold'}>
                        {i + 1}
                      </ThemeIcon>

                      <Text component="span" inherit fz={'sm'}>
                        {lii}
                      </Text>
                    </Group>
                  </ListItem>
                ))}
              </List>
            </Stack>

            <Stack mt={SECTION_SPACING}>
              <Title order={2} fz={'lg'} c={'sec'}>
                Good to Know
              </Title>

              <List listStyleType="none" spacing={'xs'}>
                {goodToKnow.map((lii, i) => (
                  <ListItem key={lii}>
                    <Group wrap="nowrap" align="start" gap={'xs'}>
                      <ThemeIcon
                        size={ICON_WRAPPER_SIZE - 4}
                        c={'ter'}
                        color="dark"
                        variant="transparent"
                      >
                        <IconCheck size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                      </ThemeIcon>

                      <Text component="span" inherit fz={'sm'}>
                        {lii}
                      </Text>
                    </Group>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Stack>
              <Title order={2} fz={'lg'} c={'sec'}>
                Questions
              </Title>

              <AccordionFaq props={{ items: faqLoyalty }} />
            </Stack>
          </GridCol>
        </Grid>
      </LayoutSection>
    </Box>
  );
}

const THRESHOLD = 12;

const howToJoin = [
  'Order at any MoTown Pizza store or online',
  'Give us your name, phone number and Email',
  'You’re automatically registered and start earning points immediately',
];

const goodToKnow = [
  'One point per pizza purchased',
  'Points from different sizes cannot be mixed',
  '12 points = 1 free pizza of the same size',
  'Points expire after 6 months of no activity',
  'Free pizzas come from the standard loyalty menu',
  'Extras like additional toppings, extra cheese, or stuffed crust upgrades will be charged',
  'Points cannot be transferred or exchanged for cash',
  'One account per phone number',
];

function CardLoyalty({
  phone,
  pizzaSize,
  orders,
}: {
  phone: string;
  pizzaSize?: any;
  orders: OrderGet[] | null;
}) {
  const desktop = useMediaQuery('(min-width: 62em)');
  const { ref, width } = useElementSize();

  return (
    <Card p={0} bg={'transparent'} style={{ zIndex: 1 }}>
      <Box pos={'relative'}>
        <Overlay backgroundOpacity={0.8} style={{ zIndex: 0 }} />

        <BackgroundImage
          src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
          radius="var(--mantine-default-radius)"
        >
          <WrapperUnderlayBlur>
            <Stack p={{ base: 'md', md: 'xl' }}>
              <Flex
                justify={{ md: 'space-between' }}
                direction={{ base: 'column-reverse', md: 'row' }}
                align={'start'}
              >
                <Box mt={{ md: 'xl' }}>
                  <Title order={2} fz={'xl'} c={'white'}>
                    {capitalizeWords(pizzaSize?.title || '')} Pizza Points
                  </Title>
                  {
                    <Text fz={'sm'} c={'dark.1'}>
                      Slice points coupon for {!orders?.length ? '?' : phone}.
                    </Text>
                  }
                </Box>

                <div>
                  <Text fz={'xl'} c={'dark.1'} fw={'bold'}>
                    <Text component="span" inherit fz={'var(--mantine-h1-font-size)'} c={'sec'}>
                      {!orders ? '?' : !pizzaSize ? orders.length : pizzaSize.timesPurchased}
                    </Text>
                    <Text component="span" inherit display={!pizzaSize ? 'none' : undefined}>
                      /{THRESHOLD}
                    </Text>
                  </Text>
                </div>
              </Flex>

              <SimpleGrid cols={6} my={'md'}>
                {Array.from({ length: THRESHOLD }).map((_, index) => {
                  // Check if this item comes at or after the CURRENT threshold
                  const isAfterCurrent = !pizzaSize ? true : index >= pizzaSize.timesPurchased;
                  const thresholdReached = !pizzaSize
                    ? false
                    : index + 1 == pizzaSize.timesPurchased &&
                      pizzaSize.timesPurchased == THRESHOLD;

                  return (
                    <ThemeIcon
                      key={index}
                      size={'100%'}
                      ref={ref}
                      h={width}
                      radius={999}
                      variant={thresholdReached ? 'filled' : isAfterCurrent ? 'outline' : 'filled'}
                      color={thresholdReached ? 'ter' : isAfterCurrent ? 'white' : 'sec'}
                      c={thresholdReached ? 'black' : isAfterCurrent ? 'white' : 'black'}
                      style={{
                        opacity: thresholdReached ? undefined : isAfterCurrent ? 0.4 : 1,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {/* {JSON.stringify(index)} */}
                      {thresholdReached ? (
                        <Text
                          component="span"
                          inherit
                          c={'white'}
                          fw={'bold'}
                          fz={'sm'}
                          ta={'center'}
                        >
                          Free <br />
                          Pizza
                        </Text>
                      ) : isAfterCurrent ? (
                        <Text
                          component="span"
                          inherit
                          c={'white'}
                          fw={'bold'}
                          fz={'sm'}
                          ta={'center'}
                        >
                          {index + 1}
                        </Text>
                      ) : (
                        <IconPizzaFilled
                          size={!desktop ? ICON_SIZE : ICON_SIZE * 1.5}
                          style={{ transform: 'rotate(180deg)' }}
                        />
                      )}
                    </ThemeIcon>
                  );
                })}
              </SimpleGrid>

              <Divider color="pri" style={{ opacity: 0.4 }} />

              <Group wrap="nowrap" gap={'xs'}>
                <Box c={'ter'}>
                  <IconStar size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                </Box>

                <Text fz={'sm'} c={'dark.1'}>
                  {!orders || !pizzaSize ? '?' : THRESHOLD - pizzaSize.timesPurchased} more Medium
                  pizzas and the next is free.
                </Text>
              </Group>
            </Stack>
          </WrapperUnderlayBlur>
        </BackgroundImage>
      </Box>
    </Card>
  );
}
