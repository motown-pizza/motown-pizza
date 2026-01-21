/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import {
  IconBellRinging,
  IconHeart,
  IconHelpCircle,
  IconInfoCircle,
  IconLicense,
  IconLock,
  IconLogout,
  IconPackage,
  IconStar,
  IconUser,
} from '@tabler/icons-react';
import { AUTH_URLS } from '@/data/constants';

export type Link = { link: string; label: string };

export type NavLink = Link & { subLinks: Link[] | null };

export const links: NavLink[] = [
  {
    link: '/about',
    label: 'About Us',
    subLinks: null,
  },
  {
    link: '/menu',
    label: 'Menu',
    subLinks: null,
  },
  {
    link: '/menu?menuTab=sides',
    label: 'Sides',
    subLinks: null,
  },
  {
    link: '/menu?menuTab=drinks',
    label: 'Drinks',
    subLinks: null,
  },
  {
    link: '/loyalty-program',
    label: 'Loyalty Program',
    subLinks: null,
  },
];

export const userLinkItems = {
  activity: [
    {
      icon: IconHeart,
      link: `/account/wishlist`,
      label: 'My Wishlist',
    },
    {
      icon: IconPackage,
      link: `/account/orders`,
      label: 'My Orders',
    },
    {
      icon: IconStar,
      link: `/account/reviews`,
      label: 'My Reviews',
    },
  ],
  account: [
    {
      icon: IconUser,
      link: `/account/profile`,
      label: 'Profile Settings',
    },
    {
      icon: IconLock,
      link: `/account/security`,
      label: 'Account Security',
    },
    // {
    // 	icon: IconCoins,
    // 	link: `/account/payment`,
    // 	label: "Payment Details",
    // },
    // {
    // 	icon: IconMapPin,
    // 	link: `/account/addresses`,
    // 	label: "Addresses",
    // },
    {
      icon: IconBellRinging,
      link: `/account/notifications`,
      label: 'Notifications',
    },
  ],
  support: [
    {
      icon: IconHelpCircle,
      link: `/help`,
      label: 'Help Center',
    },
    {
      icon: IconLicense,
      link: `/legal/terms-and-conditions`,
      label: 'Terms and Conditions',
    },
    {
      icon: IconInfoCircle,
      link: `/legal/privacy-policy`,
      label: 'Privacy Policy',
    },
  ],
  danger: [
    {
      icon: IconLogout,
      link: AUTH_URLS.SIGN_OUT,
      label: 'Sign Out',
    },
  ],
};
