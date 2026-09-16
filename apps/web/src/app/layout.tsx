import type { Metadata } from 'next';
import { Montserrat, Geist_Mono } from 'next/font/google';
import { APP_DESC, APP_NAME, getApiUrl } from '@repo/constants';
import { ProviderMantine } from '@repo/ui';
import { ProviderInitialize } from '@web/ui/provider/initialize';
import { ProviderSync } from '@web/ui/provider/sync';
import { ColorSchemeScript, MantineColorScheme, mantineHtmlProps } from '@mantine/core';
import { getAppTheme } from '@repo/constants';
import { getAppResolver } from '@web/resolver';
import { ColorScheme } from '@repo/types';

import './globals.css';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { createClientcloudbaseServer } from '@repo/cloudbase';
// import '@mantine/dates/styles.css';
// // ‼️ import schedule styles after core and dates package styles
// import '@mantine/schedule/styles.css';

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
  description: APP_DESC.WEB,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClientcloudbaseServer();
  const { data: session } = await supabase.auth.getUser();

  const resolvedTheme = ColorScheme.DARK as MantineColorScheme;

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme={resolvedTheme}
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          viewport-fit="cover"
        />

        <ColorSchemeScript defaultColorScheme={resolvedTheme} />
      </head>

      <body className="min-h-full flex flex-col">
        <ProviderMantine
          options={{ withNotifications: true }}
          colorScheme={resolvedTheme}
          theme={getAppTheme}
          cssVariablesResolver={getAppResolver}
        >
          <ProviderInitialize
            props={{ baseUrl: await getApiUrl(), sessionUser: session.user || null }}
          >
            <ProviderSync>{children}</ProviderSync>
          </ProviderInitialize>
        </ProviderMantine>
      </body>
    </html>
  );
}
