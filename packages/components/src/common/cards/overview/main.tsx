'use client';

import React from 'react';
import {
  Card,
  CardProps,
  Group,
  NumberFormatter,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';

export type OverviewProps = {
  title: string;
  value: number;
  icon?: { icon: Icon; color?: string };
  analytics: {
    change: number;
    changeType: 'down' | 'up' | string;
    desc: string;
  };
};

export default function Main({
  props,
  ...restProps
}: { props: OverviewProps } & CardProps) {
  return (
    <Card bg={'var(--mantine-color-dark-9)'} {...restProps}>
      <Stack>
        <Group align="end" justify="space-between">
          <Title order={3} fz={'lg'} fw={500}>
            {props.title}
          </Title>

          {props.icon && (
            <ThemeIcon
              size={ICON_WRAPPER_SIZE + 4}
              radius={'sm'}
              color={`${props.icon.color}.6`}
            >
              <props.icon.icon
                size={ICON_SIZE + 4}
                stroke={ICON_STROKE_WIDTH}
              />
            </ThemeIcon>
          )}
        </Group>

        <div>
          <Text fw={'bold'} fz={'var(--mantine-h1-font-size)'}>
            <NumberFormatter value={props.value} />
          </Text>

          <Text fz={'md'}>
            <Text
              component="span"
              inherit
              fw={500}
              c={props.analytics.changeType == 'down' ? 'red.6' : 'green.6'}
            >
              <NumberFormatter value={props.analytics.change} /> %
            </Text>{' '}
            {props.analytics.desc}
          </Text>
        </div>
      </Stack>
    </Card>
  );
}
