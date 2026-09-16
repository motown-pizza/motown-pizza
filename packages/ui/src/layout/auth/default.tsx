import React from 'react';
import { ImageDefault } from '../../image/default';
import {
  Stack,
  Card,
  Group,
  Container,
  Grid,
  GridCol,
  Center,
  BackgroundImage,
  Overlay,
  Box,
} from '@mantine/core';
import { images } from '@repo/constants';
import { COMPANY_NAME } from '@repo/constants';
import { SECTION_SPACING } from '@repo/constants';
import { AnchorNextLink } from '../../anchor/next-link';
import { getThemeLogo } from '@repo/utils';

export async function LayoutAuthDefault({ children }: { children: React.ReactNode }) {
  const logo = await getThemeLogo({
    darkImage: images.brand.logo.landscape.meta,
    lightImage: images.brand.logo.landscape.meta,
  });

  return (
    <>
      {/* <Container size="xs">
        <Stack justify="center" mih={'100vh'} px={{ base: 0, sm: 40 }} py={SECTION_SPACING}>
          <Card bg={'light-dark(var(--mantine-color-body))'} p={{ base: 'xl', xs: 40 }} withBorder>
            <Stack gap={'xl'}>
              {logo && (
                <Group justify="center">
                  <AnchorNextLink href={'/'}>
                    <ImageDefault
                      src={logo}
                      alt={COMPANY_NAME}
                      height={90}
                      width={100}
                      fit="contain"
                    />
                  </AnchorNextLink>
                </Group>
              )}

              {children}
            </Stack>
          </Card>
        </Stack>
      </Container> */}

      <Grid gap={0} px={{ base: 'md', xs: 0 }}>
        {logo && (
          <GridCol
            span={6.5}
            order={{ md: 2 }}
            visibleFrom="md"
            bg={'var(--mantine-color-pri-light)'}
          >
            <BackgroundImage src={BG_IMAGE} pos={'relative'}>
              <Overlay backgroundOpacity={0.3} style={{ zIndex: 0 }} />

              <Box style={{ position: 'relative', zIndex: 1 }}>
                <Container size="xs" pos={'sticky'} top={0}>
                  <Center h={'100vh'} px={{ xs: 32 }}>
                    <AnchorNextLink href={'/'}>
                      <ImageDefault
                        src={logo}
                        alt={COMPANY_NAME}
                        height={200}
                        width={210}
                        fit="contain"
                      />
                    </AnchorNextLink>
                  </Center>
                </Container>
              </Box>
            </BackgroundImage>
          </GridCol>
        )}

        <GridCol span={{ base: 12, md: 5.5 }} order={{ md: 1 }}>
          <Container size="xs">
            <Stack gap={'xl'} justify="center" mih={'100vh'} px={{ xs: 32 }} py={SECTION_SPACING}>
              {children}
            </Stack>
          </Container>
        </GridCol>
      </Grid>
    </>
  );
}

const BG_IMAGE =
  'https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
