import React from 'react';
import { Metadata } from 'next';
import { LayoutMain } from '@repo/ui';
// import AffixNavbar from '@repo/ui/common/affixi/navbar';
import { APP_NAME } from '@repo/constants';
import HeaderMain from '@web/ui/layout/header/main';
import NavbarMain from '@web/ui/layout/navbar/main';
import FooterMain from '@web/ui/layout/footer/main';

export const metadata: Metadata = {
  title: { default: APP_NAME.WEB, template: `%s - ${APP_NAME.WEB}` },
};

export default async function LayoutMarketing({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain header={<HeaderMain />} nav={<NavbarMain />} footer={<FooterMain />}>
      <main>{children}</main>

      {/* <AffixNavbar>
        <NavbarMain />
      </AffixNavbar> */}
    </LayoutMain>
  );
}
