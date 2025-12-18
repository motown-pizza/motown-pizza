'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import {
  Anchor,
  Container,
  createTheme,
  Loader,
  MantineThemeOverride,
  Notification,
} from '@mantine/core';
import cx from 'clsx';

export type AppThemeProps = {
  theme?: MantineThemeOverride;
  styleSheets?: { anchor?: any; container?: any; notification?: any };
};

export const getAppTheme = (params?: AppThemeProps) => {
  const componentAnchor = {
    Anchor: Anchor.extend({
      defaultProps: { underline: 'never' },
      classNames: params?.styleSheets?.anchor,
    }),
  };

  const componentContainer = {
    Container: Container.extend({
      defaultProps: {
        mx: 'auto',
      },

      classNames: (_: unknown, { size }: { size?: unknown }) => ({
        root: cx({
          [params?.styleSheets?.container.root]: size === 'responsive',
        }),
      }),
    }),
  };

  const componentNotification = {
    Notification: Notification.extend({
      classNames: params?.styleSheets?.notification,
    }),
  };

  const componentsWithStyles = {
    ...(params?.styleSheets?.anchor ? componentAnchor : {}),
    ...(params?.styleSheets?.container ? componentContainer : {}),
    ...(params?.styleSheets?.notification ? componentNotification : {}),
  };

  const baseTheme: MantineThemeOverride = {
    colors: {
      pri: [
        '#ffe7e8',
        '#ffcece',
        '#ff9b9b',
        '#ff6464',
        '#fe3736',
        '#fe1b19',
        '#fe0000', // src
        '#e40000',
        '#cb0000',
        '#b20000',
      ],
      sec: [
        '#ffffe1',
        '#ffffcc',
        '#ffff9a',
        '#ffff64',
        '#ffff38',
        '#ffff1d',
        '#ffff00', // src
        '#e3e300',
        '#c9ca00',
        '#adae00',
      ],
      ter: [
        '#e9ffe4',
        '#d5ffcd',
        '#aaff9b',
        '#7dff64',
        '#57ff37',
        '#3fff1c',
        '#36ff10', // src
        '#20e300',
        '#12ca00',
        '#00ae00',
      ],
    },

    primaryColor: 'pri',
    defaultRadius: 'lg',
    primaryShade: { light: 6, dark: 6 },
    cursorType: 'pointer',

    headings: {
      fontFamily: 'var(--font-montserrat)',
    },

    components: {
      Container: Container.extend({
        defaultProps: {
          mx: 'auto',
        },

        classNames: (_: unknown, { size }: { size?: unknown }) => ({
          root: cx({
            [params?.styleSheets?.container.root]: size === 'responsive',
          }),
        }),
      }),

      Loader: Loader.extend({
        defaultProps: {
          type: 'bars',
          size: 'sm',
        },
      }),

      ...componentsWithStyles,
    },
  };

  return createTheme({
    ...baseTheme,
    ...(params?.theme || {}),
  });
};
