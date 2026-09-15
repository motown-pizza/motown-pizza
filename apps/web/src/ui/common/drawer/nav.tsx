'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Burger, Drawer, Group, Stack } from '@mantine/core';
import { AnchorNextLink, ImageDefault } from '@repo/ui';
import classes from './nav.module.css';
import { APP_NAME, images } from '@repo/constants';

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
      <Drawer
        opened={opened}
        onClose={close}
        size={'xs'}
        title={
          <>
            <AnchorNextLink href="/" underline="never">
              <ImageDefault
                src={images.brand.logo.landscape.meta}
                alt={APP_NAME.WEB}
                height={{ base: 70 }}
                width={{ base: 80 }}
                fit="contain"
                mode="grid"
                style={{ transform: 'scale(1.3)' }}
              />
            </AnchorNextLink>
          </>
        }
      >
        <Stack pt={'xs'}>
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
