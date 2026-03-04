'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Drawer,
  Group,
  Indicator,
  ScrollArea,
  Stack,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { IconBell, IconBellCheck, IconX } from '@tabler/icons-react';
import { Tabs } from '@mantine/core';

export default function Notifications({
  children,
}: {
  children?: React.ReactNode;
}) {
  const icon = (
    <Tooltip label={'Open notifications'}>
      <Group>
        <ActionIcon variant={'light'} size={ICON_WRAPPER_SIZE} color={'dark'}>
          <IconBell size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>
    </Tooltip>
  );

  return (
    <NotificationDrawer>
      <Indicator
        offset={2}
        color="pri.6"
        size={18}
        label={3}
        // styles={{ indicator: { color: 'black' } }}
      >
        {children || icon}
      </Indicator>
    </NotificationDrawer>
  );
}

function NotificationDrawer({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size={'xs'}
        padding={0}
      >
        <ScrollArea h={'100vh'} scrollbars={'y'}>
          <Box
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: 'var(--mantine-color-body)',
            }}
          >
            <Group justify="space-between" align="end" p={'sm'}>
              <Title order={3} fz={'md'} fw={500}>
                Notification Area
              </Title>

              <ActionIcon
                variant={'light'}
                size={ICON_WRAPPER_SIZE}
                color={'pri.6'}
                onClick={close}
              >
                <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>

            <Divider />
          </Box>

          <NotificationTabs />
        </ScrollArea>
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}

function NotificationTabs() {
  const Empty = ({ props }: { props: { name: string } }) => {
    return (
      <Center py={SECTION_SPACING}>
        <Stack align="center" ta={'center'}>
          <ThemeIcon
            variant={'light'}
            size={ICON_WRAPPER_SIZE * 2}
            color={'ter.6'}
            onClick={close}
          >
            <IconBellCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>

          <Text inherit c={'dimmed'} maw={240} fz={'sm'}>
            You don&apos;t have {props.name}. Check back later for updates.
          </Text>
        </Stack>
      </Center>
    );
  };

  return (
    <Tabs defaultValue="all" variant="pills">
      <Box
        style={{
          position: 'sticky',
          top: 53,
          zIndex: 10,
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <TabsList p={'sm'}>
          <TabsTab value="all">All</TabsTab>
          <TabsTab value="messages">Messages</TabsTab>
          <TabsTab value="alerts">Alerts</TabsTab>
        </TabsList>

        <Divider />
      </Box>

      <TabsPanel value="all">
        {<Empty props={{ name: 'any notifications' }} />}
      </TabsPanel>

      <TabsPanel value="messages">
        {<Empty props={{ name: 'any messages' }} />}
      </TabsPanel>

      <TabsPanel value="alerts">
        {<Empty props={{ name: 'any alerts' }} />}
      </TabsPanel>
    </Tabs>
  );
}
