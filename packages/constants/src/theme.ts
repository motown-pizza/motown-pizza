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
  Divider,
  Drawer,
  Loader,
  MantineThemeOverride,
  Menu,
  Modal,
  Notification,
  NumberFormatter,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import cx from 'clsx';
import { ICON_STROKE_WIDTH } from './sizes';

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

      Anchor: Anchor.extend({
        defaultProps: { underline: 'never' },
      }),

      Divider: Divider.extend({
        defaultProps: { color: 'var(--mantine-color-default-border)' },
      }),

      Menu: Menu.extend({
        defaultProps: {
          transitionProps: {
            duration: 100,
          },
        },
        styles: {
          dropdown: {
            backgroundColor: 'var(--mantine-color-body)',
            borderColor: 'var(--mantine-color-default-border)',
            padding: 'var(--mantine-spacing-xs)',
          },
        },
      }),

      Tooltip: Tooltip.extend({
        defaultProps: { withArrow: true, openDelay: 500 },
      }),

      NumberFormatter: NumberFormatter.extend({
        defaultProps: { thousandSeparator: true },
      }),

      ScrollArea: ScrollArea.extend({
        defaultProps: { scrollbarSize: ICON_STROKE_WIDTH * 4, type: 'auto' },
        styles: { scrollbar: { zIndex: 100 } },
      }),

      Loader: Loader.extend({
        defaultProps: {
          type: 'bars',
          size: 'sm',
        },
      }),

      Modal: Modal.extend({
        defaultProps: {
          centered: true,
          transitionProps: {
            duration: 100,
            transition: 'fade',
          },
          overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
          },
        },
      }),

      Drawer: Drawer.extend({
        defaultProps: {
          transitionProps: {
            duration: 100,
          },
          overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
          },
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
