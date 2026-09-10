import {
  IconBowlChopsticks,
  IconBrandAirtable,
  IconHome,
  IconToolsKitchen,
} from '@tabler/icons-react';
import { cleanPaths } from '@repo/utils';
import { NavLink } from '@repo/types';

export const links: NavLink[] = [
  {
    link: '/',
    label: 'Home',
    subLinks: null,
  },
  {
    link: '/about',
    label: 'About',
    subLinks: null,
  },
];

export const posLinks: NavLink[] = [
  {
    link: '/pos',
    label: 'Home',
    subLinks: null,
    icon: IconHome,
  },
  {
    link: '/pos/menu',
    label: 'Menu',
    subLinks: null,
    icon: IconBowlChopsticks,
  },
  {
    link: '/pos/orders',
    label: 'Orders',
    subLinks: null,
    icon: IconToolsKitchen,
  },
  {
    link: '/pos/tables',
    label: 'Tables',
    subLinks: null,
    icon: IconBrandAirtable,
  },
];

const mainLinks = links.map((l) => l.link);
const subLinks: string[] = [];

links.map((l) => {
  if (l.subLinks) {
    l.subLinks.map((sl) => {
      subLinks.push(sl.link);
    });
  }
});

export const unprotectedRoutes = [
  ...cleanPaths(
    [
      '/',
      ...mainLinks,
      ...subLinks,
      // '/legal/terms',
      // '/legal/policy',
    ].filter((l) => !l.startsWith('/#')),
  ),
];

export const sitemapRoutes = [...unprotectedRoutes].filter((l) => l != '/');
