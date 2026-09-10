'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { ActionIcon, Divider, Grid, GridCol, Group, Stack, Text, Title } from '@mantine/core';
import { AnchorNextLink } from '@repo/ui';
import classes from './main.module.css';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { SOCIALS } from '@repo/constants';
import { APP_NAME } from '@repo/constants';
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
      bg={'var(--mantine-color-pri-6)'}
    >
      <LayoutSection id={'footer-main'}>
        <Grid gap={{ base: 'xl' }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Grid justify="center" gap={{ base: 'xl', xs: 'md' }}>
              {linkGroups.map((lg, i) => (
                <GridCol key={i} span={{ base: 12, xs: 6, sm: 4 }}>
                  <Title order={2} fz={'lg'} c={'white'} ta={{ base: 'center', md: 'start' }}>
                    {lg.title}
                  </Title>

                  <Stack gap={5} mt={'xs'} align="start">
                    {lg.links.map((l, i) => (
                      <AnchorNextLink
                        key={i}
                        href={l.link}
                        underline="never"
                        className={classes.link}
                        ta={{ base: 'center', md: 'start' }}
                      >
                        {l.label}
                      </AnchorNextLink>
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
                    <a key={i} href={'#'}>
                      <ActionIcon size={ICON_WRAPPER_SIZE + 4} variant="white" c={'dark'}>
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

      <LayoutSection id={'footer-main-fine'}>
        <Divider color="yellow.6" mt={'xl'} mb={'xl'} />

        <Group justify="center" fz={'sm'} c={'white'}>
          <Text inherit>
            © {new Date().getFullYear()} {APP_NAME.WEB}. All rights reserved.
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
    label: SOCIALS.X.label,
    link: SOCIALS.X.link,
  },
  {
    icon: IconBrandFacebook,
    label: SOCIALS.FB.label,
    link: SOCIALS.FB.link,
  },
  {
    icon: IconBrandInstagram,
    label: SOCIALS.IG.label,
    link: SOCIALS.IG.link,
  },
  {
    icon: IconBrandLinkedin,
    label: SOCIALS.LI.label,
    link: SOCIALS.LI.link,
  },
];
