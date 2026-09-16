'use client';

import React from 'react';
import { LayoutSection } from '@repo/ui';
import { ActionIcon, Divider, Flex, Grid, GridCol, Group, Stack, Text, Title } from '@mantine/core';
import { AnchorNextLink } from '@repo/ui';
import classes from './main.module.css';
import {
  EMAILS,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  PHONES,
  SECTION_SPACING,
} from '@repo/constants';
import { SOCIALS } from '@repo/constants';
import { APP_NAME } from '@repo/constants';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react';

export default function Main() {
  return (
    <>
      <Divider />

      <LayoutSection
        id={'footer-main'}
        containerized={false}
        padded={SECTION_SPACING}
        bg={'var(--mantine-color-dark-9)'}
      >
        <LayoutSection id={'footer-main'}>
          <Grid gap={{ base: 'xl' }} pb={SECTION_SPACING}>
            <GridCol span={{ base: 12, md: 8 }}>
              <Grid justify="center" gap={{ base: 'xl', xs: 'md' }}>
                {linkGroups.map((lg, i) => (
                  <GridCol key={i} span={{ base: 12, sm: 4 }}>
                    <Title order={2} fz={'lg'} c={'sec'}>
                      {lg.title}
                    </Title>

                    <Stack gap={'xs'} mt={'xl'} align="start">
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
              <div>
                <Title order={2} fz={'lg'} c={'sec'}>
                  {contact.title}
                </Title>

                <Stack gap={'xs'} mt={'xl'}>
                  {contact.links.map((l) => (
                    <AnchorNextLink
                      key={l.link}
                      href={l.link}
                      underline="never"
                      className={classes.link}
                    >
                      <Group wrap="nowrap">
                        {l.location && (
                          <Text component="span" inherit miw={100}>
                            {l.location}:
                          </Text>
                        )}

                        <span>{l.label}</span>
                      </Group>
                    </AnchorNextLink>
                  ))}
                </Stack>
              </div>
            </GridCol>
          </Grid>
        </LayoutSection>

        <LayoutSection id={'footer-main-fine'}>
          <Divider color="pri" mb={'xl'} />

          <Flex
            gap={'md'}
            align={'center'}
            direction={{ base: 'column', sm: 'row' }}
            justify={{ sm: 'space-between' }}
            fz={'sm'}
            c={'white'}
          >
            <Text inherit>
              © {new Date().getFullYear()} {APP_NAME.WEB}. All rights reserved.
            </Text>

            <Group justify="center" gap={'xs'}>
              {social.map((si, i) => (
                <a key={i} href={si.link} target="_blank">
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE + 8}
                    color={'pri'}
                    c={'var(--mantine-color-white'}
                  >
                    <si.icon size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </a>
              ))}
            </Group>
          </Flex>
        </LayoutSection>
      </LayoutSection>
    </>
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
        label: 'Loyalty Program',
        link: '/loyalty-program',
      },
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

const contact = {
  title: 'Contact',
  links: [
    { label: EMAILS.INFO, link: `mailto:${EMAILS.INFO}` },
    { location: 'Westlands', label: `${PHONES.PHONE1}`, link: `tel:${PHONES.PHONE1}` },
    { location: 'Valley Arcade', label: `${PHONES.PHONE2}`, link: `tel:${PHONES.PHONE2}` },
    { location: 'Kileleshwa', label: `${PHONES.PHONE3}`, link: `tel:${PHONES.PHONE3}` },
  ],
};

const social = [
  {
    icon: IconBrandX,
    label: SOCIALS.X.label,
    link: SOCIALS.X.link,
  },
  // {
  //   icon: IconBrandFacebook,
  //   label: SOCIALS.FB.label,
  //   link: SOCIALS.FB.link,
  // },
  {
    icon: IconBrandInstagram,
    label: SOCIALS.IG.label,
    link: SOCIALS.IG.link,
  },
  // {
  //   icon: IconBrandLinkedin,
  //   label: SOCIALS.LI.label,
  //   link: SOCIALS.LI.link,
  // },
  {
    icon: IconBrandTiktok,
    label: SOCIALS.TI.label,
    link: SOCIALS.TI.link,
  },
  {
    icon: IconBrandYoutube,
    label: SOCIALS.YT.label,
    link: SOCIALS.YT.link,
  },
];
