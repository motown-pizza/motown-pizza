import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { setCookieClient } from '@repo/utils';
import { WEEK } from '@repo/constants';
import { COOKIE_NAME } from '@repo/constants';
import classes from './cookies.module.css';
import { AnchorNextLink } from '../anchor/next-link';

export function CardCookies({ close }: { close: () => void }) {
  const handleConsentCookie = () => {
    setCookieClient(COOKIE_NAME.CONSENT_COOKIES, true, {
      expiryInSeconds: WEEK,
    });
    close();
  };

  return (
    <Card className={classes.card}>
      <Stack>
        <Text fz={'sm'}>
          This website uses cookies to provide a seamless user experience. Accepting our cookies is
          optional but recommended, as they are delicious. See our{' '}
          <AnchorNextLink inherit href="/legal/cookie-policy">
            cookie policy
          </AnchorNextLink>
          .
        </Text>

        <Group gap={'xs'}>
          <Button size="xs" onClick={handleConsentCookie}>
            Accept All
          </Button>
          <Button size="xs" onClick={close} variant="light">
            Reject All
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
