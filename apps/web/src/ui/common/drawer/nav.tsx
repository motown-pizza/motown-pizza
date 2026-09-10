'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Burger, Drawer, Group, Stack } from '@mantine/core';
import { AnchorNextLink } from '@repo/ui';
import classes from './nav.module.css';

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
              <AnchorNextLink
                href={li.link}
                fw={500}
                tt={'uppercase'}
                underline="never"
                className={classes.link}
                onClick={close}
              >
                {li.label}
              </AnchorNextLink>
            </Group>
          ))}

          <AnchorNextLink
            href={'/contact'}
            fw={500}
            tt={'uppercase'}
            underline="never"
            className={classes.link}
            onClick={close}
          >
            Contact
          </AnchorNextLink>
        </Stack>
      </Drawer>

      <span onClick={open}>{children || <Burger />}</span>
    </>
  );
}
