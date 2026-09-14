import {
  IconCategory,
  IconLabel,
  IconLogout,
  IconPackage,
  IconSettings,
  IconUserEdit,
} from '@tabler/icons-react';
import { AUTH_URLS } from './paths';
import { NavLink } from '@repo/types';

export const navLinkItems = {
  user: {
    activity: [
      // {
      //   icon: IconHeart,
      //   link: `/account/wishlist`,
      //   label: 'My Wishlist',
      // },
      {
        icon: IconPackage,
        link: `/account/orders`,
        label: 'My Orders',
      },
      // {
      //   icon: IconStar,
      //   link: `/account/reviews`,
      //   label: 'My Reviews',
      // },
    ] satisfies NavLink[],

    account: [
      {
        icon: IconUserEdit,
        link: `/account/profile`,
        label: 'Edit Profile',
      },
      {
        icon: IconSettings,
        link: `/account/settings`,
        label: 'Account Settings',
      },
    ] satisfies NavLink[],

    danger: [
      {
        icon: IconLogout,
        link: AUTH_URLS.SIGN_OUT,
        label: 'Sign Out',
      },
    ] satisfies NavLink[],
  },
};

export const navLinkApp = [
  {
    label: 'Account Groups',
    icon: IconLabel,
  },
  {
    label: 'Categories',
    icon: IconCategory,
  },
  {
    label: 'Settings',
    icon: IconSettings,
  },
];
