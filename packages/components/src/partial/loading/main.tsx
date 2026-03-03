import { Center, Stack } from '@mantine/core';
import LayoutSection from '@repo/components/layout/section';
import LoaderMain from '@repo/components/common/loaders/main';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@repo/constants/images';
import { COMPANY_NAME } from '@repo/constants/app';

export default function Main() {
  return (
    <LayoutSection id={'loading-404'}>
      <Center mih={'100vh'}>
        <Stack align="center">
          <ImageDefault
            src={images.brand.logo.potrait.meta}
            alt={COMPANY_NAME}
            height={240}
            width={240}
            // fit="contain"
            mode="grid"
          />

          <LoaderMain />
        </Stack>
      </Center>
    </LayoutSection>
  );
}
