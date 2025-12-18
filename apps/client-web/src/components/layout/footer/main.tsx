'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  ActionIcon,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import NextLink from '@repo/components/common/anchor/next-link';
import classes from './main.module.scss';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { appName, socials } from '@repo/constants/app';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react';

export default function Main() {
  return (
    <LayoutSection
      id={'footer-main'}
      containerized={false}
      pt={SECTION_SPACING}
      pb={'md'}
      bg={'var(--mantine-color-blue-6)'}
    >
      <LayoutSection id={'footer-main'}>
        <Grid gutter={{ base: 'xl' }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Grid justify="center" gutter={{ base: 'xl', xs: 'md' }}>
              {linkGroups.map((lg, i) => (
                <GridCol key={i} span={{ base: 12, xs: 6, sm: 4 }}>
                  <Title
                    order={2}
                    fz={'md'}
                    c={'white'}
                    ta={{ base: 'center', md: 'start' }}
                  >
                    {lg.title}
                  </Title>

                  <Stack gap={5} mt={'xs'}>
                    {lg.links.map((l, i) => (
                      <NextLink
                        key={i}
                        href={l.link}
                        underline="never"
                        className={classes.link}
                        ta={{ base: 'center', md: 'start' }}
                      >
                        {l.label}
                      </NextLink>
                    ))}
                  </Stack>
                </GridCol>
              ))}
            </Grid>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <Group justify="center">
              <Stack align="center">
                <Title order={2} fz={'md'} c={'white'} ta={'center'}>
                  Socials
                </Title>

                <Group justify="center">
                  {social.map((si, i) => (
                    <a key={i}>
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE}
                        variant="white"
                        c={'dark.9'}
                      >
                        <si.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                      </ActionIcon>
                    </a>
                  ))}
                </Group>
              </Stack>
            </Group>
          </GridCol>
        </Grid>
      </LayoutSection>

      <Divider color="white" mt={'xl'} mb={'md'} />

      <LayoutSection id={'footer-main-fine'}>
        <Group justify="center" fz={'sm'} c={'white'}>
          <Text inherit>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
        </Group>
      </LayoutSection>
    </LayoutSection>
  );
}

const linkGroups = [
  {
    title: 'Menu',
    links: [
      { label: 'Pizzas', link: '/menu?menuTab=pizzas' },
      { label: 'Sides', link: '/menu?menuTab=sides' },
      { label: 'Drinks', link: '/menu?menuTab=drinks' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', link: '/about' },
      { label: 'Contact', link: '/contact' },
      {
        label: "Loyalty FAQ's",
        link: '/loyalty-program#page-loyalty-program-faq',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', link: '/privacy-policy' },
      { label: 'Terms of Service', link: '/terms-conditions' },
    ],
  },
];

const social = [
  {
    icon: IconBrandX,
    label: socials[0].label,
    link: socials[0].link,
  },
  {
    icon: IconBrandFacebook,
    label: socials[1].label,
    link: socials[1].link,
  },
  {
    icon: IconBrandInstagram,
    label: socials[2].label,
    link: socials[2].link,
  },
  {
    icon: IconBrandLinkedin,
    label: socials[3].label,
    link: socials[3].link,
  },
];
