import { LayoutMain } from '@repo/ui';
import { AffixNavbar } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import {
  BackgroundImage,
  Box,
  Divider,
  Grid,
  GridCol,
  Group,
  Overlay,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import HeaderMain from '@web/ui/layout/header/main';
import NavbarMain from '@web/ui/layout/navbar/main';
import FooterMain from '@web/ui/layout/footer/main';
import { AnchorNextLink } from '@repo/ui';
import { OrderFulfilmentType } from '@repo/types';
import { ImageDefault } from '@repo/ui';
import { images } from '@repo/constants';
import { SECTION_SPACING } from '@repo/constants';
import TabDeliveryType from '@web/ui/common/tabs/order-type';
import { APP_NAME } from '@repo/constants';

export default function Home() {
  return (
    <HomeLayout>
      <LayoutSection
        id="home-page-intro"
        pt={SECTION_SPACING}
        mb={SECTION_SPACING * 2}
        containerized={'sm'}
      >
        <Stack gap={'xl'} px={SECTION_SPACING}>
          <Group justify="center">
            <ImageDefault
              src={images.brand.logo.landscape.meta}
              alt={APP_NAME.WEB}
              height={90}
              width={100}
              fit="contain"
              mode="grid"
              style={{ transform: 'scale(1.3)' }}
            />
          </Group>

          <Group grow preventGrowOverflow={false} gap={'xs'} px={SECTION_SPACING}>
            <Divider color="ter" />

            <Text ta={'center'} fz={'xl'} w={'fit-coontent'} lh={{ base: 2, xs: 1 }}>
              Select your order type
            </Text>

            <Divider color="ter" />
          </Group>

          <TabDeliveryType />
        </Stack>
      </LayoutSection>

      <LayoutSection
        id="home-page-intro"
        mt={SECTION_SPACING * 2}
        pb={SECTION_SPACING * 2}
        containerized={'md'}
      >
        <Grid>
          <GridCol span={{ base: 12, md: 9 }}>
            <AnchorNextLink
              href={`/order/select-store?orderType=${OrderFulfilmentType.DELIVERY.toLowerCase()}`}
              underline="never"
            >
              <BackgroundImage
                src={images.home.main}
                style={{ position: 'relative' }}
                h={'100%'}
                c={'white'}
              >
                <Overlay backgroundOpacity={0.4} style={{ zIndex: 0 }} />

                <Box style={{ position: 'relative', zIndex: 1 }}>
                  <Stack align="center" gap={0} py={SECTION_SPACING}>
                    <Title order={1} ta={'center'}>
                      Motown Deal
                    </Title>

                    <Text fz={'md'} fw={500} ta={'center'}>
                      Any large Pizza + 6 Pcs Wings + 1.25L Drink
                    </Text>

                    <Title order={1} ta={'center'}>
                      1,800/-
                    </Title>
                  </Stack>
                </Box>
              </BackgroundImage>
            </AnchorNextLink>
          </GridCol>

          <GridCol span={{ base: 12, md: 3 }}>
            <Stack gap={'sm'} h={'100%'} justify="space-between">
              <AnchorNextLink
                href={`/order/select-store?orderType=${OrderFulfilmentType.DELIVERY.toLowerCase()}`}
                underline="never"
              >
                <ImageDefault
                  src={images.home.tuesday}
                  alt="Tuesday Special"
                  height={{ base: 260 }}
                  width={'100%'}
                  fit="contain"
                />
              </AnchorNextLink>

              <AnchorNextLink
                href={`/order/select-store?orderType=${OrderFulfilmentType.DELIVERY.toLowerCase()}`}
                underline="never"
              >
                <ImageDefault
                  src={images.home.double}
                  alt="Double Offer"
                  height={{ base: 260 }}
                  width={'100%'}
                  fit="contain"
                />
              </AnchorNextLink>
            </Stack>
          </GridCol>
        </Grid>
      </LayoutSection>
    </HomeLayout>
  );
}

async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutMain header={<HeaderMain />} nav={<NavbarMain />} footer={<FooterMain />}>
      <div>
        <main>{children}</main>

        <AffixNavbar>
          <NavbarMain />
        </AffixNavbar>
      </div>
    </LayoutMain>
  );
}
