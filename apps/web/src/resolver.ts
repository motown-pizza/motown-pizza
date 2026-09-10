'use client';

import { ConvertCSSVariablesInput, CSSVariablesResolver } from '@mantine/core';

export const getAppResolver = (params?: { cssVars?: ConvertCSSVariablesInput }) => {
  const appResolver: CSSVariablesResolver = (theme) => {
    const baseCssVars = {
      variables: {},

      light: {
        '--mantine-color-body': `${theme.white}`,
        '--mantine-color-text': `var(--mantine-color-dark-6)`,
      },

      dark: {
        '--mantine-color-body': `var(--mantine-color-dark-9)`,
        '--mantine-color-text': `var(--mantine-color-dark-0)`,
        '--mantine-color-default-border': `light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-6))`,
      },
    };

    return { ...baseCssVars, ...(params?.cssVars || {}) };
  };

  return appResolver;
};
