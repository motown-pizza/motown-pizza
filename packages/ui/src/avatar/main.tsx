'use client';

import { initialize } from '@repo/utils';
import { ActionIcon, Avatar, Group, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import classes from './main.module.css';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IconUser } from '@tabler/icons-react';
import { WrapperActionSignIn } from '../wrapper/actions';
import { AuthAction } from '@repo/types';
import { useStoreSession } from '@repo/store';

export function AvatarMain({ size }: { size?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const session = useStoreSession((s) => s.session);

  return (
    <Group w={size} h={size}>
      {!mounted || session === undefined ? (
        <Skeleton h={size} w={size} radius={999} />
      ) : !session?.email ? (
        <WrapperActionSignIn options={{ action: AuthAction.SIGN_IN }}>
          <ActionIcon size={size} variant="subtle" style={{ overflow: 'visible' }}>
            <Group>
              <IconUser size={ICON_SIZE * 1.2} stroke={ICON_STROKE_WIDTH} />
            </Group>
          </ActionIcon>
        </WrapperActionSignIn>
      ) : (
        <Avatar
          className={
            !session.user_metadata.avatar_url ? classes.avatarInitials : classes.avatarImage
          }
          src={session.user_metadata.avatar_url || null}
          name={session.user_metadata.name || 'User'}
          color={'initials'}
          size={size as any}
        >
          {initialize(session.user_metadata.name || 'User')}
        </Avatar>
      )}
    </Group>
  );
}
