/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { cleanPaths } from '@repo/utilities/array';
import { NavLink } from '@repo/types/link';

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
    ].filter((l) => !l.startsWith('/#'))
  ),
];

export const sitemapRoutes = [...unprotectedRoutes].filter((l) => l != '/');
