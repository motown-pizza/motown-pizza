import { ColorScheme } from '@repo/types';

export const DEFAULT_COLOR_SCHEME: ColorScheme = ColorScheme.DARK;

const WITHOUT_BODY: HeadersInit = {
  Accept: 'application/json',
};

const WITH_BODY: HeadersInit = {
  'Content-Type': 'application/json',
  ...WITHOUT_BODY,
};

export const HEADERS = { WITHOUT_BODY, WITH_BODY };
