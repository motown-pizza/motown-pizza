'use client';

import { Box, BoxProps, Container, rem, useMantineTheme } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants';
import { SectionProps } from '@repo/types';

export function LayoutSection({
  containerized = 'responsive',
  padded,
  margined,
  className,
  bordered,
  shadowed,
  children,
  id,
  ...rest
}: SectionProps & BoxProps) {
  const theme = useMantineTheme();

  const py =
    typeof padded === 'boolean'
      ? SECTION_SPACING * 2
      : typeof padded !== 'undefined'
        ? padded
        : undefined;

  const my =
    typeof margined === 'boolean'
      ? SECTION_SPACING * 2
      : typeof margined !== 'undefined'
        ? margined
        : undefined;

  const isResponsive = containerized === 'responsive';

  return (
    <Box
      component="section"
      id={id}
      py={py}
      my={my}
      className={className}
      style={{
        borderBottom: bordered ? '1px solid var(--mantine-color-default-border)' : undefined,
        boxShadow: shadowed ? 'var(--mantine-shadow-xs)' : undefined,
      }}
      {...rest}
    >
      {containerized ? (
        <Container
          size={isResponsive || containerized === true ? undefined : containerized}
          h={'100%'}
          styles={{
            root: {
              ...(containerized === 'responsive' && {
                maxWidth: 'var(--mantine-breakpoint-xl) !important',

                [`@media (min-width: ${theme.breakpoints.sm})`]: {
                  paddingInline: 'var(--mantine-spacing-xl) !important',
                },

                [`@media (min-width: ${theme.breakpoints.xl})`]: {
                  paddingInline: 'calc(var(--mantine-spacing-xl) * 2) !important',
                },
              }),
            },
          }}
        >
          {children}
        </Container>
      ) : (
        children
      )}
    </Box>
  );
}
