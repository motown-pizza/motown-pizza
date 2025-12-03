import React from 'react';
import { ProductGet } from '@repo/types/models/product';
import {
  ActionIcon,
  Card,
  Center,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import ImageDefault from '@repo/components/common/images/default';
import { useStoreVariant } from '@/libraries/zustand/stores/variant';
import { capitalizeWords } from '@repo/utilities/string';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useStoreOrderDetails } from '@/libraries/zustand/stores/order-details';
import { defaultOrderDetails } from '@/data/orders';
import { IconX } from '@tabler/icons-react';

export default function Summary({ props }: { props: ProductGet }) {
  const external = props.image.includes('https');
  const drink = props.image.includes('drink');

  const { variants } = useStoreVariant();
  const { orderDetails, setOrderDetails } = useStoreOrderDetails();

  const productVariant = (variants || []).find(
    (v) => v.id == props.selected_variant_id
  );

  return (
    <Card bg={'transparent'} padding={0} pr={'md'}>
      <Grid align="center" gutter={'xs'}>
        <GridCol span={1.5}>
          <Center mih={80} miw={80}>
            <ImageDefault
              src={props.image}
              alt={props.title}
              width={{ base: external || drink ? 80 : 60 }}
              height={{ base: external || drink ? 80 : 60 }}
              fit={external || drink ? undefined : 'contain'}
              radius={'lg'}
            />
          </Center>
        </GridCol>

        <GridCol span={7.5}>
          <Stack gap={0} justify="space-between" h={'100%'}>
            <div>
              <Title order={3} fz={'md'} fw={500} c={'sec.6'}>
                {props.title}
              </Title>

              {productVariant && (
                <>
                  <Text fz={'sm'}>
                    Size:{' '}
                    <Text component="span" inherit fz={'sm'} fw={'bold'}>
                      {capitalizeWords(productVariant.size)}
                    </Text>
                  </Text>
                </>
              )}

              {props.ingredients && <Text fz={'sm'}>{props.ingredients}</Text>}
            </div>
          </Stack>
        </GridCol>

        <GridCol span={3}>
          <Group justify="space-between">
            {props.quantity && (
              <Text fz={'sm'}>
                Qty:{' '}
                <Text component="span" inherit fz={'md'} fw={'bold'}>
                  <NumberFormatter value={props.quantity} />
                </Text>
              </Text>
            )}

            {productVariant && (
              <Text fz={'sm'} ta={'end'}>
                Kshs.{' '}
                <Text component="span" inherit fz={'md'} fw={'bold'}>
                  <NumberFormatter value={productVariant.price || 0} />
                </Text>
              </Text>
            )}

            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              color="gray.9"
              onClick={() => {
                setOrderDetails({
                  ...(orderDetails || defaultOrderDetails),
                  products: (
                    orderDetails || defaultOrderDetails
                  ).products.filter((ci) => ci.id != props.id),
                });
              }}
            >
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>
        </GridCol>
      </Grid>
    </Card>
  );
}
