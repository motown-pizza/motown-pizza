/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import LayoutPage from '@repo/components/layout/page';
import LayoutBody from '@repo/components/layout/body';
import AffixNavbar from '@repo/components/common/affixi/navbar';
import LayoutSection from '@repo/components/layout/section';
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
import HeaderMain from '@/components/layout/header/main';
import NavbarMain from '@/components/layout/navbar/main';
import FooterMain from '@/components/layout/footer/main';
import NextLink from '@repo/components/common/anchor/next-link';
import { OrderType } from '@repo/types/models/enums';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Home() {
  return (
    <HomeLayout>
      <LayoutSection id="home-page-intro" padded={'xl'} containerized={'md'}>
        <Group grow preventGrowOverflow={false}>
          <Divider color="ter" />

          <Text ta={'center'} fz={24} w={'fit-coontent'}>
            Is your order for{' '}
            <NextLink
              href={`/order/select-store?orderType=${OrderType.DELIVERY.toLowerCase()}`}
              underline="never"
            >
              <Text
                component="span"
                inherit
                tt={'uppercase'}
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  backgroundColor: 'var(--mantine-color-sec-6)',
                  color: 'var(--mantine-color-red-7)',
                  padding:
                    'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                  borderRadius: 'var(--mantine-radius-lg)',
                }}
              >
                delivery
              </Text>
            </NextLink>{' '}
            or{' '}
            <NextLink
              href={`/order/select-store?orderType=${OrderType.COLLECTION.toLowerCase()}`}
              underline="never"
            >
              <Text
                component="span"
                inherit
                tt={'uppercase'}
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  backgroundColor: 'var(--mantine-color-blue-6)',
                  color: 'var(--mantine-color-white)',
                  padding:
                    'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                  borderRadius: 'var(--mantine-radius-lg)',
                }}
              >
                collection
              </Text>
            </NextLink>
          </Text>

          <Divider color="ter" />
        </Group>
      </LayoutSection>

      <LayoutSection id="home-page-intro" padded={'xl'} containerized={'md'}>
        <Grid>
          <GridCol span={{ base: 12, md: 9 }}>
            <NextLink
              href={`/order/select-store?orderType=${OrderType.DELIVERY.toLowerCase()}`}
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

                    <Text fz={'md'} fw={500}>
                      Any large Pizza + 6 Pcs Wings + 1.25L Drink
                    </Text>

                    <Title order={1} ta={'center'}>
                      1,800/-
                    </Title>
                  </Stack>
                </Box>
              </BackgroundImage>
            </NextLink>
          </GridCol>

          <GridCol span={{ base: 12, md: 3 }}>
            <Stack gap={'sm'} h={'100%'} justify="space-between">
              <NextLink
                href={`/order/select-store?orderType=${OrderType.DELIVERY.toLowerCase()}`}
                underline="never"
              >
                <ImageDefault
                  src={images.home.tuesday}
                  alt="Tuesday Special"
                  height={{ base: 260 }}
                  width={'100%'}
                  fit="contain"
                />
              </NextLink>

              <NextLink
                href={`/order/select-store?orderType=${OrderType.DELIVERY.toLowerCase()}`}
                underline="never"
              >
                <ImageDefault
                  src={images.home.double}
                  alt="Double Offer"
                  height={{ base: 260 }}
                  width={'100%'}
                  fit="contain"
                />
              </NextLink>
            </Stack>
          </GridCol>
        </Grid>
      </LayoutSection>
    </HomeLayout>
  );
}

async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutBody
      header={<HeaderMain />}
      nav={<NavbarMain />}
      footer={<FooterMain />}
    >
      <LayoutPage>
        <main>{children}</main>

        <AffixNavbar>
          <NavbarMain />
        </AffixNavbar>
      </LayoutPage>
    </LayoutBody>
  );
}
