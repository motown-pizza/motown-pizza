'use client';

import React from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useStoreOrder, useStoreOrderItem } from '@repo/store';
import { Order, OrderGet } from '@repo/types';
import {
  AnchorNextLink,
  BadgeOrderType,
  BadgeStatus,
  LayoutIntroSection,
  LayoutSection,
} from '@repo/ui';
import { ButtonCopy } from '@repo/ui';
import { getRegionalDate, sortArray } from '@repo/utils';

export default function Orders() {
  const orders = useStoreOrder((s) => s.orders);

  return (
    <LayoutSection id="page-orders" padded containerized={'sm'}>
      <LayoutIntroSection
        props={{ title: 'My Orders', subTitle: 'Account' }}
        options={{ spacing: true }}
      />

      <Card bg={'var(--mantine-color-dark-9)'} withBorder>
        <Stack>
          <Group justify="end">
            <AnchorNextLink href="/order/select-store?orderType=delivery">
              <Button color="sec" c={'dark.9'}>
                Order Now
              </Button>
            </AnchorNextLink>
          </Group>

          {orders === undefined ? (
            <Center mih={MIN_HEIGHT}>
              <Loader />
            </Center>
          ) : !orders?.length ? (
            <LayoutSection id="page-orders-empty" containerized={'xs'}>
              <Stack gap={'xl'} align="center" ta={'center'} justify="center" mih={MIN_HEIGHT}>
                <Title order={2} fz={'xl'}>
                  No Orders
                </Title>

                <Text inherit fz={'md'} c={'dimmed'}>
                  You haven&apos;t placed any orders yet. When you place an order, it will appear
                  here.
                </Text>

                <Group>
                  <AnchorNextLink href="/order/select-store?orderType=delivery">
                    <Button>Order Now</Button>
                  </AnchorNextLink>

                  <AnchorNextLink href="/menu">
                    <Button color="sec" c={'dark.9'}>
                      See Menu
                    </Button>
                  </AnchorNextLink>
                </Group>
              </Stack>
            </LayoutSection>
          ) : (
            <Box mih={MIN_HEIGHT}>
              {sortArray(orders, (i) => i.createdAt, Order.DESCENDING)?.map((oi, i) => (
                <div key={oi.id}>
                  {i > 0 && <Divider />}

                  <CardOrder props={oi} />
                </div>
              ))}
            </Box>
          )}
        </Stack>
      </Card>
    </LayoutSection>
  );
}

const MIN_HEIGHT = 400;
const now = new Date();

function CardOrder({ props }: { props: OrderGet }) {
  const orderItems = useStoreOrderItem((s) => s.orderItems);
  const orderItemsOrder = orderItems?.filter((oii) => oii.orderId == props.id);

  const orderDate = getRegionalDate(props?.createdAt || now);

  return (
    <Card bg={'transparent'} px={0}>
      <Flex
        direction={{ base: 'column', xs: 'row' }}
        align={{ base: 'start', xs: 'center' }}
        gap={{ base: 'xl', xs: 'md' }}
        justify="space-between"
        wrap="nowrap"
      >
        <Stack gap={5}>
          <Group gap={'xs'} align="end" wrap="nowrap">
            <Title order={2} fz={'md'} fw={500}>
              {props.trackingCode}
            </Title>

            <Box h={28}>
              <ButtonCopy clipboardItem={props.trackingCode} />
            </Box>
          </Group>

          <Group>
            <Text inherit fz={'sm'}>
              {orderDate.date}, {orderDate.time.toUpperCase()}
            </Text>
          </Group>

          <Flex
            mt={5}
            fz={'sm'}
            gap={'md'}
            direction={{ base: 'column', xs: 'row' }}
            align={{ base: 'start', xs: 'center' }}
          >
            <Group gap={'xs'}>
              <Text component="span" inherit>
                Type:
              </Text>
              <BadgeOrderType props={props} />
            </Group>

            {/* <Group gap={'xs'}>
              <Text component="span" inherit>
                Status:
              </Text>
              <BadgeStatus props={{ status: props.orderStatus }} />
            </Group> */}

            <Group fz={'sm'}>
              <Text inherit>
                Items:{' '}
                <Text component="span" inherit c={'sec'} fw={500}>
                  <NumberFormatter value={orderItemsOrder?.length} />
                </Text>
              </Text>
            </Group>
          </Flex>
        </Stack>

        <Group justify="end">
          <AnchorNextLink href={`/account/orders/${props.id}`}>
            <Button size="xs">View Order</Button>
          </AnchorNextLink>
        </Group>
      </Flex>
    </Card>
  );
}
