import React from 'react';
import { ImageDefault } from '../../image/default';
import { Stack, Card, Group, Container } from '@mantine/core';
import { images } from '@repo/constants';
import { COMPANY_NAME } from '@repo/constants';
import { SECTION_SPACING } from '@repo/constants';
import { AnchorNextLink } from '../../anchor/next-link';
import { getThemeLogo } from '@repo/utils';

export async function LayoutAuthDefault({ children }: { children: React.ReactNode }) {
  const logo = await getThemeLogo({
    darkImage: images.brand.logo.landscape.default,
    lightImage: images.brand.logo.landscape.default,
  });

  return (
    <>
      <Container size="xs">
        <Stack justify="center" mih={'100vh'} px={{ base: 0, sm: 40 }} py={SECTION_SPACING}>
          <Card bg={'light-dark(var(--mantine-color-body))'} p={{ base: 'xl', xs: 40 }} withBorder>
            <Stack gap={'xl'}>
              {logo && (
                <Group justify="center">
                  <AnchorNextLink href={'/'}>
                    <ImageDefault
                      src={logo}
                      alt={COMPANY_NAME}
                      height={48}
                      width={48}
                      fit="contain"
                    />
                  </AnchorNextLink>
                </Group>
              )}

              {children}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
