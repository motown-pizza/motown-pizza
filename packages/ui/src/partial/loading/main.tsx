import { Center, Stack } from '@mantine/core';
import { LayoutSection } from '../../layout/section';
import { LoaderMain } from '../../loader/main';
import { ImageDefault } from '../../image/default';
import { APP_NAME, images } from '@repo/constants';

export function PartialLoadingMain() {
  return (
    <LayoutSection id={'loading-main'}>
      <Center mih={'100vh'}>
        <Stack align="center" gap={'xl'}>
          <ImageDefault
            src={images.brand.logo.landscape.meta}
            alt={APP_NAME.WEB}
            height={{ base: 70 }}
            width={{ base: 80 }}
            fit="contain"
            mode="grid"
            style={{ transform: 'scale(1.3)' }}
          />

          <LoaderMain />
        </Stack>
      </Center>
    </LayoutSection>
  );
}
