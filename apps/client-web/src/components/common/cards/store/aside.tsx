import React from 'react';
import { Card, Group, Stack, Text } from '@mantine/core';
import { IconBuildingStore, IconMapPin, IconPhone } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { StoreGet } from '@repo/constants/stores';

export default function Aside({ props }: { props: StoreGet }) {
  return (
    <Card bg={'var(--mantine-color-dark-6)'}>
      {/* <Box
        component="iframe"
        src={props.iframe}
        loading="lazy"
        w={'100%'}
        h={{ base: 200 }}
        style={{ border: 0, borderRadius: 'var(--mantine-radius-lg)' }}
        // allowfullscreen=""
        // referrerpolicy="no-referrer-when-downgrade"
      ></Box> */}

      <Stack
        gap={5}
        fz={'sm'}
        // mt={'md'}
      >
        <Group gap={5}>
          <IconBuildingStore size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          <Text inherit>{props.title}</Text>
        </Group>

        <Group gap={5}>
          <IconMapPin size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          <Text inherit>{props.location}</Text>
        </Group>

        <Group gap={5}>
          <IconPhone size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          <Text inherit>{props.phone}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
