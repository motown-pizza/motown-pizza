'use client';

import { LayoutSection } from '@repo/ui';
import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import { AnchorNextLink } from '@repo/ui';
import { ImageDefault } from '@repo/ui';
import { defaultOrderDetails, images, stores } from '@repo/constants';
import { SECTION_SPACING } from '@repo/constants';
import { APP_NAME } from '@repo/constants';
import {
  useOrderActions,
  useProfileActions,
  useStoreOrderPlacement,
  useStoreProfile,
  useStoreSession,
} from '@repo/store';
import { OrderFulfilmentType, OrderGet } from '@repo/types';
import { generateUUID } from '@repo/utils';

export default function Home() {
  const session = useStoreSession((s) => s.session);
  const profiles = useStoreProfile((s) => s.profiles);
  const currentProfile = profiles?.find((pi) => pi.id == session?.id);

  const { setOrderDetails } = useStoreOrderPlacement();
  const { orderCreate } = useOrderActions();

  const handleStartOrder = (fulfillmentType: OrderFulfilmentType) => {
    const newOrderId = generateUUID();
    const fullName = `${currentProfile?.firstName || ''} ${currentProfile?.lastName || ''}`.trim();
    const newOrder: OrderGet = {
      ...defaultOrderDetails,
      id: newOrderId,
      customerName: fullName,
      fulfillmentType,
    };

    orderCreate(newOrder, { stores });
    setOrderDetails(newOrder);
  };

  return (
    <div>
      <LayoutSection id="home-page-intro" margined={SECTION_SPACING} containerized={'xl'}>
        <Grid gap={0} pos={'relative'}>
          <GridCol span={{ base: 12, md: 2 }}>
            <Box pos={'sticky'} top={SECTION_SPACING * 2}>
              <Card bg={'transparent'} withBorder style={{ borderStyle: 'dashed' }}>
                <Stack>
                  <Title order={1} fz={'sm'} tt={'uppercase'} ta={'center'} c={'sec'}>
                    Start Your Order
                  </Title>

                  <Divider />

                  <AnchorNextLink href={`/order/select-menu`}>
                    <Button
                      fullWidth
                      size="md"
                      onClick={() => handleStartOrder(OrderFulfilmentType.DELIVERY)}
                    >
                      Delivery
                    </Button>
                  </AnchorNextLink>

                  <Divider
                    label={'or'}
                    color="sec"
                    styles={{
                      label: {
                        color: 'var(--mantine-color-sec-6)',
                        // fontSize: 'var(--mantine-font-size-md)',
                      },
                    }}
                  />

                  <AnchorNextLink href={`/order/select-menu`}>
                    <Button
                      fullWidth
                      size="md"
                      onClick={() => handleStartOrder(OrderFulfilmentType.COLLECTION)}
                    >
                      Collection
                    </Button>
                  </AnchorNextLink>
                </Stack>
              </Card>
            </Box>
          </GridCol>

          <GridCol span={{ md: 0.5 }}>
            <Center py={'xl'} h={'100%'} visibleFrom="md">
              <Divider orientation="vertical" color="sec" h={'100%'} />
            </Center>

            <Box my={'xl'}>
              <Divider color="sec" hiddenFrom="md" />
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, md: 7 }}>
            <AnchorNextLink href={`/order/select-menu`} underline="never">
              <ImageDefault
                src={images.theme.menu.tuesday}
                alt={APP_NAME.WEB}
                height={{ base: 140, xs: 240, sm: 320, md: 240, lg: 320 }}
                width={'100%'}
                fit="contain"
                mode="grid"
              />
            </AnchorNextLink>

            <Box px={'xl'}>
              <Divider color="pri" mt={'md'} mb={'md'} />
            </Box>

            <AnchorNextLink href={`/order/select-menu`} underline="never">
              <ImageDefault
                src={images.theme.menu.thursday}
                alt={APP_NAME.WEB}
                height={{ base: 100, xs: 160, sm: 200, md: 160, lg: 200 }}
                width={'100%'}
                fit="contain"
                mode="grid"
              />
            </AnchorNextLink>

            <Box px={'xl'}>
              <Divider color="ter" mt={'md'} mb={'lg'} />
            </Box>

            <AnchorNextLink href={`/order/select-menu`} underline="never">
              <ImageDefault
                src={images.theme.menu.sunday}
                alt={APP_NAME.WEB}
                height={{ base: 90, xs: 140, sm: 190, md: 140, lg: 190 }}
                width={'100%'}
                fit="contain"
                mode="grid"
              />
            </AnchorNextLink>

            <Box px={'xl'}>
              <Divider color="sec" mt={'md'} mb={'xl'} />
            </Box>

            <Grid>
              <GridCol span={{ base: 12, md: 6 }}>
                <Grid>
                  <GridCol span={{ base: 12, xs: 6, md: 12 }}>
                    <AnchorNextLink href={`/order/select-menu`} underline="never">
                      <ImageCard>
                        <ImageDefault
                          src={images.theme.menu.beefPizza}
                          alt="Double Offer"
                          height={{ base: 300, xs: 240, sm: 280, md: 240, lg: 280 }}
                          width={'100%'}
                          // fit="contain"
                        />
                      </ImageCard>
                    </AnchorNextLink>
                  </GridCol>

                  <GridCol span={{ base: 12 }} visibleFrom="md">
                    <Box px={'xl'}>
                      <Divider color="pri" mt={'xl'} mb={'xl'} />
                    </Box>
                  </GridCol>

                  <GridCol span={{ base: 12, xs: 6, md: 12 }}>
                    <AnchorNextLink href={`/order/select-menu`} underline="never">
                      <ImageCard>
                        <ImageDefault
                          src={images.theme.menu.veggiePizza}
                          alt="Double Offer"
                          height={{ base: 250, xs: 200, sm: 260, md: 200, lg: 245 }}
                          width={'100%'}
                          // fit="contain"
                        />
                      </ImageCard>
                    </AnchorNextLink>
                  </GridCol>
                </Grid>
              </GridCol>

              <GridCol span={{ base: 12, md: 6 }}>
                <Grid>
                  <GridCol span={{ base: 12, xs: 6, md: 12 }}>
                    <AnchorNextLink href={`/order/select-menu`} underline="never">
                      <ImageCard>
                        <ImageDefault
                          src={images.theme.menu.chickenPizza}
                          alt="Double Offer"
                          height={{ base: 220, xs: 180, sm: 240, md: 180, lg: 225 }}
                          width={'100%'}
                          // fit="contain"
                        />
                      </ImageCard>
                    </AnchorNextLink>
                  </GridCol>

                  <GridCol span={{ base: 12 }} visibleFrom="md">
                    <Box px={'xl'}>
                      <Divider color="ter" mt={'xl'} mb={'xl'} />
                    </Box>
                  </GridCol>

                  <GridCol span={{ base: 12, xs: 6, md: 12 }}>
                    <AnchorNextLink href={`/order/select-menu`} underline="never">
                      <ImageCard>
                        <ImageDefault
                          src={images.theme.menu.addons}
                          alt="Double Offer"
                          height={{ base: 260, xs: 210, sm: 280, md: 210, lg: 265 }}
                          width={'100%'}
                          // fit="contain"
                        />
                      </ImageCard>
                    </AnchorNextLink>
                  </GridCol>
                </Grid>
              </GridCol>

              <GridCol span={{ base: 12 }}>
                <Box px={'xl'}>
                  <Divider color="ter" my={'xs'} />
                </Box>
              </GridCol>

              <GridCol span={{ base: 12 }}>
                <Grid>
                  <GridCol span={{ base: 12, xs: 8, sm: 6, md: 8 }}>
                    <AnchorNextLink href={`/order/select-menu`} underline="never">
                      <ImageCard>
                        <ImageDefault
                          src={images.theme.menu.prices}
                          alt="Double Offer"
                          height={{ base: 100, lg: 140 }}
                          width={'100%'}
                          fit="contain"
                        />
                      </ImageCard>
                    </AnchorNextLink>
                  </GridCol>
                </Grid>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={{ md: 0.5 }} visibleFrom="md">
            <Center py={'xl'} h={'100%'}>
              <Divider orientation="vertical" color="sec" h={'100%'} />
            </Center>
          </GridCol>

          <GridCol span={{ base: 12, md: 2 }} visibleFrom="md">
            <Box pos={'sticky'} top={SECTION_SPACING * 2}>
              <AnchorNextLink href={`/order/select-menu`} underline="never">
                <ImageCard>
                  <ImageDefault
                    src={images.theme.deals}
                    alt="Tuesday Special"
                    height={{ base: 220 }}
                    width={'100%'}
                    // fit="contain"
                  />
                </ImageCard>
              </AnchorNextLink>
            </Box>
          </GridCol>
        </Grid>
      </LayoutSection>

      {/* <LayoutSection
        id="home-start-order"
        pt={SECTION_SPACING * 2}
        mb={SECTION_SPACING * 2}
        containerized={'sm'}
      >
        <Stack gap={'xl'} px={{ sm: SECTION_SPACING }}>
          <Group grow preventGrowOverflow={false} gap={'xs'} px={SECTION_SPACING}>
            <Divider color="ter" />

            <Text ta={'center'} fz={'xl'} w={'fit-coontent'} lh={{ base: 2, xs: 1 }}>
              Select your order type
            </Text>

            <Divider color="ter" />
          </Group>

          <ImageDefault
            src={images.theme.footer}
            alt={APP_NAME.WEB}
            height={33}
            width={'100%'}
            fit="contain"
            mode="grid"
          />

          <TabDeliveryType />
        </Stack>
      </LayoutSection> */}

      <Divider />

      <Group justify="center">
        <ImageDefault
          src={images.theme.footer2}
          alt={APP_NAME.WEB}
          height={{ base: 60, xs: 90, sm: 120, md: 160, lg: 190, xl: 230 }}
          width={'100%'}
          // fit="contain"
          mode="grid"
        />
      </Group>

    </div>
  );
}

function ImageCard({ children }: { children: React.ReactNode }) {
  return (
    <Card padding={0} bg={'transparent'} withBorder style={{ borderStyle: 'dashed' }}>
      {children}
    </Card>
  );
}
