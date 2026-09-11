'use client';

import { useState } from 'react';
import { Affix, AffixBaseProps, Transition } from '@mantine/core';
import { CardCookies } from '../card/cookies';
import { getCookieClient } from '@repo/utils';
import { COOKIE_NAME } from '@repo/constants';

export function AffixCookies({
  position = {
    bottom: 'var(--mantine-spacing-xl)',
    left: 'var(--mantine-spacing-xl)',
  },
  ...restProps
}: { position?: AffixBaseProps['position'] } & Omit<AffixBaseProps, 'position' | 'children'>) {
  const consentCookie = getCookieClient(COOKIE_NAME.CONSENT_COOKIES);
  const [opened, setOpened] = useState(consentCookie == 'true' ? false : true);

  return (
    <Affix position={position} {...restProps}>
      <Transition mounted={opened} duration={250} timingFunction="ease" transition={'fade'}>
        {(styles) => (
          <div style={styles}>
            <CardCookies close={() => setOpened(false)} />
          </div>
        )}
      </Transition>
    </Affix>
  );
}
