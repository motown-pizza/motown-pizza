import { COOKIE_NAME, DEFAULT_COLOR_SCHEME } from '@repo/constants';
import { getCookieServer } from './cookie-server';
import { ColorScheme } from '@repo/types';
import { getOSTheme } from './misc';

export const getThemeLogo = async (params: { lightImage: string; darkImage: string }) => {
  const themeCookie = (await getCookieServer(COOKIE_NAME.COLOR_SCHEME)) || DEFAULT_COLOR_SCHEME;

  // Resolve 'auto' using your OS theme helper
  const resolvedTheme = getOSTheme(themeCookie as ColorScheme);

  if (resolvedTheme === ColorScheme.DARK) return params.darkImage;
  return params.lightImage; // Defaults to light if not dark
};
