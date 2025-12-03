'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Burger, Drawer, Group, Stack } from '@mantine/core';
import NextLink from '@repo/components/common/anchor/next-link';
import classes from './nav.module.scss';

export default function Nav({
  links,
  children,
}: {
  links: { link: string; label: string }[];
  children?: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} size={'xs'}>
        <Stack>
          {links.map((li, i) => (
            <Group key={i}>
              <NextLink
                href={li.link}
                fw={500}
                tt={'uppercase'}
                underline="never"
                className={classes.link}
              >
                {li.label}
              </NextLink>
            </Group>
          ))}

          <NextLink
            href={'/contact'}
            fw={500}
            tt={'uppercase'}
            underline="never"
            className={classes.link}
          >
            Contact
          </NextLink>
        </Stack>
      </Drawer>

      <span onClick={open}>{children || <Burger />}</span>
    </>
  );
}
