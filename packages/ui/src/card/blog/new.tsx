'use client';

import React from 'react';
import {
  Badge,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import classes from './new.module.css';
import { linkify } from '@repo/utils';
import { getRegionalDate } from '@repo/utils';
import { PostRelations } from '@repo/types';
import { IconCircleFilled, IconMessageCircle } from '@tabler/icons-react';
import { ImageDefault } from '../../image/default';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { AnchorNextLink } from '../../anchor/next-link';

export function CardNew({ post }: { post: PostRelations }) {
  const path = `/blog/${linkify(post.title)}-${post.id}`;

  return (
    <Card className={classes.card} withBorder bg={'transparent'}>
      <Grid gap={0}>
        <GridCol span={{ base: 12, sm: 6 }}>
          <AnchorNextLink underline="hover" inherit href={path} pos={'relative'}>
            <ImageDefault src={post.image} alt={post.title} height={400} mode="grid" />
          </AnchorNextLink>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6 }}>
          <Stack
            gap={'lg'}
            px={{ base: 'lg', sm: 'xl' }}
            py={{ base: 'lg', md: 32 }}
            justify="space-between"
            h={'100%'}
          >
            <Stack>
              <Badge
                size="sm"
                color="blue"
                radius={'sm'}
                leftSection={<IconCircleFilled size={4} />}
              >
                latest
              </Badge>

              <Title order={3} fz={28} lh={{ md: 1 }} className={classes.title}>
                <AnchorNextLink underline="hover" inherit href={path} c={'inherit'}>
                  {post.title}
                </AnchorNextLink>
              </Title>

              <Text className={classes.desc} lineClamp={6}>
                {post.excerpt}
              </Text>
            </Stack>

            <Stack>
              <Divider />

              <Group justify="space-between" fz={'sm'}>
                <Group gap={'xs'}>
                  <Text inherit>{getRegionalDate(post.createdAt).date}</Text>

                  <IconCircleFilled size={4} />

                  <AnchorNextLink
                    href={`/blog/categories/${post.category?.id}`}
                    underline="never"
                    inherit
                  >
                    {post.category?.title}
                  </AnchorNextLink>
                </Group>

                {post._count.comments && (
                  <Group gap={4}>
                    <IconMessageCircle size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />

                    <NumberFormatter thousandSeparator value={post._count.comments} />
                  </Group>
                )}
              </Group>
            </Stack>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
