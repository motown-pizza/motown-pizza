import { getUrlPrefix, HOSTNAME_CLIENT_POS } from '@repo/constants/paths';

export const APP_NAME = 'MoTown POS';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_POS)}${HOSTNAME_CLIENT_POS}`;

export const AUTH_URLS = {
  SIGN_IN: `${BASE_URL_CLIENT}/auth/sign-in`,
  SIGN_UP: `${BASE_URL_CLIENT}/auth/sign-up`,
  CHECK_EMAIL: `${BASE_URL_CLIENT}/auth/check-email`,
  ERROR: `${BASE_URL_CLIENT}/auth/error`,
  SIGN_OUT: `${BASE_URL_CLIENT}/auth/sign-out`,
  REDIRECT: { DEFAULT: '/' },
};

export const APP_SHELL = {
  HEADER_HEIGHT: 60,
  FOOTER_HEIGHT: 60,
};
