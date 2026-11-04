import { cleanPaths } from '@repo/utils';
import { NavLink } from '@repo/types';

export const links: NavLink[] = [
  {
    link: '/order/select-menu?menuTab=pizzas',
    label: 'Pizzas',
  },
  {
    link: '/order/select-menu?menuTab=sides',
    label: 'Sides',
  },
  {
    link: '/order/select-menu?menuTab=drinks',
    label: 'Drinks',
  },
  {
    link: '/loyalty-program',
    label: 'Loyalty Program',
  },
];

export const linksSecondary: NavLink[] = [
  {
    link: '/about',
    label: 'About Us',
  },
  {
    link: '/contact',
    label: 'Contact',
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
