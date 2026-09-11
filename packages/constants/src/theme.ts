'use client';

import {
  Anchor,
  Checkbox,
  Container,
  createTheme,
  Divider,
  Drawer,
  Fieldset,
  HoverCard,
  List,
  Loader,
  MantineThemeOverride,
  Menu,
  Modal,
  Notification,
  NumberFormatter,
  NumberInput,
  PasswordInput,
  Popover,
  ScrollArea,
  ScrollAreaAutosize,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
// import cx from 'clsx';
import { ICON_STROKE_WIDTH } from './sizes';
import { DateInput, DateTimePicker } from '@mantine/dates';

export type AppThemeProps = {
  theme?: MantineThemeOverride;
  styleSheets?: { anchor?: any; container?: any; notification?: any };
};

export const getAppTheme = (params?: AppThemeProps) => {
  const componentAnchor = {
    Anchor: Anchor.extend({
      defaultProps: { underline: 'never' },
      // classNames: params?.styleSheets?.anchor,
    }),
  };

  // const componentContainer = {
  //   Container: Container.extend({
  //     defaultProps: {
  //       mx: 'auto',
  //     },

  //     classNames: (_: unknown, { size }: { size?: unknown }) => ({
  //       root: cx({
  //         [params?.styleSheets?.container.root]: size === 'responsive',
  //       }),
  //     }),
  //   }),
  // };

  const componentNotification = {
    Notification: Notification.extend({
      // classNames: params?.styleSheets?.notification,
    }),
  };

  // const componentsWithStyles = {
  //   ...(params?.styleSheets?.anchor ? componentAnchor : {}),
  //   ...(params?.styleSheets?.container ? componentContainer : {}),
  //   ...(params?.styleSheets?.notification ? componentNotification : {}),
  // };

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
      // Container: Container.extend({
      //   defaultProps: {
      //     mx: 'auto',
      //   },

      //   classNames: (_: unknown, { size }: { size?: unknown }) => ({
      //     root: cx({
      //       [params?.styleSheets?.container.root]: size === 'responsive',
      //     }),
      //   }),
      // }),

      Loader: Loader.extend({
        defaultProps: {
          type: 'dots',
          size: 'xs',
        },
      }),

      Divider: Divider.extend({
        defaultProps: {
          color: 'var(--mantine-color-default-border)',
        },
      }),

      Anchor: Anchor.extend({
        defaultProps: { underline: 'never' },
      }),

      ScrollArea: ScrollArea.extend({
        defaultProps: {
          type: 'auto',
          scrollbarSize: 5,
        },
        styles: {
          scrollbar: { zIndex: 10 },
          thumb: {
            backgroundColor: 'light-dark(var(--mantine-color-dark-0), var(--mantine-color-dark-6))',
          },
        },
      }),

      ScrollAreaAutosize: ScrollAreaAutosize.extend({
        defaultProps: {
          type: 'auto',
          scrollbarSize: 8,
        },
        styles: {
          scrollbar: { zIndex: 10 },
          thumb: {
            backgroundColor: 'light-dark(var(--mantine-color-dark-0), var(--mantine-color-dark-6))',
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
          styles: {
            content: {
              backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-9))',
            },
          },
        },
      }),

      NumberFormatter: NumberFormatter.extend({
        defaultProps: { thousandSeparator: true },
      }),

      List: List.extend({
        defaultProps: {
          withPadding: true,
          spacing: 5,
          listStyleType: 'disc',
        },
      }),

      Fieldset: Fieldset.extend({
        styles: {
          root: {
            borderWidth: 1,
            backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
            boxShadow: 'var(--mantine-shadow-xs)',
          },
        },
      }),

      TextInput: TextInput.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          styles: {
            input: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              fontWeight: 500,
            },
          },
        },
      }),

      Checkbox: Checkbox.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          styles: {
            input: {
              borderColor: 'var(--mantine-color-default-border)',
            },
          },
        },
      }),

      Textarea: Textarea.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          styles: {
            input: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              fontWeight: 500,
            },
          },
        },
      }),

      DateInput: DateInput.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          styles: {
            input: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              fontWeight: 500,
            },
          },
        },
      }),

      DateTimePicker: DateTimePicker.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          styles: {
            input: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              fontWeight: 500,
            },
          },
        },
      }),

      PasswordInput: PasswordInput.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          styles: {
            input: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              fontWeight: 500,
            },
          },
        },
      }),

      Select: Select.extend({
        defaultProps: {
          // size: 'xs',
          variant: 'filled',
          checkIconPosition: 'right',
          styles: {
            input: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              fontWeight: 500,
            },
            dropdown: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
              borderColor: 'transparent',
              padding: 'xs',
            },
          },
        },
      }),

      Menu: Menu.extend({
        defaultProps: {
          transitionProps: {
            enterDelay: 0,
            duration: 100,
            exitDuration: 100,
            exitDelay: 0,
          },
          overlayProps: { backgroundOpacity: 0.5, blur: 4 },
          shadow: 'xs',
        },
        styles: {
          dropdown: {
            overflow: 'hidden',
            padding: 5,
            backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-9))',
            borderColor: 'transparent',
          },
          item: {
            // padding: '3px 6px',
            overflow: 'hidden',
            // borderRadius: 'var(--mantine-radius-md)',
          },
          itemLabel: { fontSize: 'var(--mantine-font-size-sm)' },
          divider: {
            borderColor: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))',
          },
        },
      }),

      HoverCard: HoverCard.extend({
        defaultProps: {
          transitionProps: {
            enterDelay: 0,
            duration: 100,
            exitDuration: 100,
            exitDelay: 0,
          },
          overlayProps: { backgroundOpacity: 0.5, blur: 4 },
          shadow: 'xs',
        },
        styles: {
          dropdown: {
            overflow: 'hidden',
            padding: 'xs',
            backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-9))',
            borderColor: 'transparent',
          },
        },
      }),

      Popover: Popover.extend({
        defaultProps: {
          transitionProps: {
            enterDelay: 0,
            duration: 100,
            exitDuration: 100,
            exitDelay: 0,
          },
        },
        styles: {
          dropdown: {
            overflow: 'hidden',
            padding: 'var(--mantine-spacing-xs)',
            backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-9))',
            borderColor: 'transparent',
          },
        },
      }),

      Tooltip: Tooltip.extend({
        defaultProps: {
          visibleFrom: 'md',
          withArrow: true,
          transitionProps: {
            duration: 100,
            transition: 'fade',
            exitDuration: 100,
            enterDelay: 500,
            exitDelay: 0,
          },
        },
      }),

      Modal: Modal.extend({
        defaultProps: {
          centered: true,
          withCloseButton: false,
          padding: 'xs',
          transitionProps: {
            enterDelay: 0,
            duration: 100,
            exitDuration: 100,
            exitDelay: 0,
            transition: 'fade',
          },
          overlayProps: {
            backgroundOpacity: 0.33,
            blur: 3,
          },
          styles: {
            content: {
              backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-9))',
            },
          },
        },
      }),

      // ...componentsWithStyles,
    },
  };

  return createTheme({
    ...baseTheme,
    // ...(params?.theme || {}),
  });
};
