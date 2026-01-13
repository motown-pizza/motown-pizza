'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Group, Modal, Text } from '@mantine/core';
import LayoutModal from '../../layout/modal';
import { Alert, Variant } from '@repo/types/enums';
import { useNotification } from '@repo/hooks/notification';

export default function Confirm({
  props,
  children,
}: {
  props?: {
    title?: string;
    desc?: string;
    cancelMessage?: string;
    confirmMessage?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
  };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { showNotification } = useNotification();

  const handleClose = () => {
    showNotification({
      title: props?.cancelMessage || 'Action canceled',
      variant: Variant.WARNING,
    });

    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        padding={'md'}
        pos={'relative'}
        withCloseButton={false}
      >
        <LayoutModal
          props={{
            title: props?.title || 'Confirm Action',
            close: handleClose,
          }}
          variant={Alert.WARNING}
        >
          <div>
            <Text>{props?.desc || 'Are you sure you want to proceed?'}</Text>
          </div>

          <Group justify="end" mt={'md'}>
            <Button
              color="red.6"
              variant="outline"
              onClick={() => {
                if (props?.onCancel) props.onCancel();
                handleClose();
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (props?.onConfirm) props.onConfirm();
                close();

                if (props?.confirmMessage) {
                  showNotification({
                    title: props.confirmMessage,
                    variant: Variant.SUCCESS,
                  });
                }
              }}
            >
              Confirm
            </Button>
          </Group>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
