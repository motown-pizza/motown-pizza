/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// custom styles
import '../styles/globals.scss';

import type { Metadata } from 'next';
import { Montserrat, Geist_Mono } from 'next/font/google';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import ProviderMantine from '@repo/components/provider/mantine';
import ProviderStore from '@/components/provider/store';
import ProviderSync from '@/components/provider/sync';
import { APP_NAME } from '@repo/constants/app';
import { mantine } from '@/data/styles';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { createClient } from '@repo/libraries/supabase/server';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP_NAME.WEB,
  description: '',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme={DEFAULT_COLOR_SCHEME}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <ColorSchemeScript defaultColorScheme={DEFAULT_COLOR_SCHEME} />
      </head>

      <body className={`${montserrat.variable} ${geistMono.variable}`}>
        <ProviderMantine
          options={{ withNotifications: true }}
          appThemeProps={{ styleSheets: { ...mantine } }}
          colorScheme={DEFAULT_COLOR_SCHEME}
          appName={APP_NAME.WEB}
        >
          <ProviderStore props={{ sessionUser: session.user }}>
            <ProviderSync>{children}</ProviderSync>
          </ProviderStore>
        </ProviderMantine>
      </body>
    </html>
  );
}
