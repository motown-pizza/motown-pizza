'use client';

import React from 'react';
import {
  AspectRatio,
  Avatar,
  Button,
  Card,
  Center,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { LayoutSection } from '@repo/ui';
import { SOCIALS } from '@repo/constants';
import { IconBrandInstagram, IconBrandTiktok, IconStar } from '@tabler/icons-react';

const reviews = [
  {
    name: 'Wanjiru K.',
    branch: 'Westlands Store',
    quote:
      'Best Detroit-style pizza in Nairobi! The crust is wonderfully crispy on the edges and soft inside. Delivery was prompt and warm.',
  },
  {
    name: 'Brian M.',
    branch: 'Valley Arcade Store',
    quote:
      'Amazing cheesy goodness. The toppings are generous and fresh. Easily our family go-to pizza spot every weekend.',
  },
  {
    name: 'Amina O.',
    branch: 'Kileleshwa Store',
    quote:
      'Quick collection turnaround and friendly staff. Love the signature pepperoni and dipping sauce. Highly recommended!',
  },
];

export default function SocialProof() {
  return (
    <LayoutSection id="home-social-proof" padded py="xl">
      {/* Reviews Section */}
      <Title order={2} c="sec" fz="h2">
        What our customers say
      </Title>
      <Text c="dimmed" mb="lg">
        Short reviews from customers, with the branch they ordered from.
      </Text>

      <Grid>
        {reviews.map((review, index) => (
          <GridCol key={index} span={{ base: 12, md: 4 }}>
            <Card bg="var(--mantine-color-dark-8)" withBorder h="100%">
              <Stack justify="space-between" h="100%">
                <div>
                  <Group gap={4} c="yellow.5" mb="sm">
                    <IconStar size={16} fill="currentColor" />
                    <IconStar size={16} fill="currentColor" />
                    <IconStar size={16} fill="currentColor" />
                    <IconStar size={16} fill="currentColor" />
                    <IconStar size={16} fill="currentColor" />
                  </Group>
                  <Text fz="sm" c="dimmed">
                    &ldquo;{review.quote}&rdquo;
                  </Text>
                </div>

                <Group gap="sm" mt="md">
                  <Avatar color="pri" radius="xl">
                    {review.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Text fw={500} fz="sm">
                      {review.name}
                    </Text>
                    <Text c="dimmed" fz="xs">
                      {review.branch}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </GridCol>
        ))}
      </Grid>

      <Text size="xs" mt="xl" c="dimmed">
        Mockup: Sample reviews. Final reviews to be supplied by management.
      </Text>

      {/* Social Section */}
      <Group justify="space-between" align="end" mt="xl" mb="md">
        <Title order={2} c="sec" fz="h2">
          Follow @motownpizza_ke
        </Title>
        <Group>
          <Button
            component="a"
            href={SOCIALS.IG.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            color="pink"
            leftSection={<IconBrandInstagram size={18} />}
          >
            Instagram
          </Button>
          <Button
            component="a"
            href={SOCIALS.TI.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            color="dark"
            leftSection={<IconBrandTiktok size={18} />}
          >
            TikTok
          </Button>
        </Group>
      </Group>

      <Grid>
        {Array.from({ length: 6 }).map((_, index) => (
          <GridCol key={index} span={{ base: 6, sm: 4, md: 2 }}>
            <AspectRatio ratio={1}>
              <Card bg="var(--mantine-color-dark-6)" radius="md">
                <Center h="100%">
                  <IconBrandInstagram size={32} color="var(--mantine-color-dark-2)" />
                </Center>
              </Card>
            </AspectRatio>
          </GridCol>
        ))}
      </Grid>
    </LayoutSection>
  );
}
