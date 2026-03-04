'use client';

import React from 'react';
import { Breadcrumbs, Button } from '@mantine/core';
import { crumbify, linkify } from '@repo/utilities/url';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Admin({
  props,
}: {
  props?: { crumbs: { link: string; label: string }[] };
}) {
  const pathname = usePathname();
  const crumbs = props?.crumbs || crumbify(pathname);

  return (
    <Breadcrumbs>
      <Breadcrumbs separatorMargin={5}>
        {crumbs.map((ci, i) => {
          const isLast = i === crumbs.length - 1;

          const sharedProps = {
            size: 'compact-sm',
            color: 'dark',
            fw: 'normal',
            variant: 'subtle',
          };

          return isLast ? (
            <Button key={ci.link} {...sharedProps} variant="transparent">
              {ci.label}
            </Button>
          ) : (
            <Button
              key={ci.link}
              {...sharedProps}
              component={Link}
              href={`/dashboard/${linkify(ci.link)}`}
            >
              {ci.label}
            </Button>
          );
        })}
      </Breadcrumbs>
    </Breadcrumbs>
  );
}
