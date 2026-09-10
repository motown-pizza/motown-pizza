'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { LayoutModal } from '../../layout/modal';
import { FormStoresProductVariant } from '../../form/stores/product-variant';
import { ProductVariantGet } from '@repo/types';

export function ModalCrudProductVariant({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<ProductVariantGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered padding={0}>
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updatedAt ? 'Edit' : 'Add'} Product Variant`,
            close,
          }}
        >
          <FormStoresProductVariant props={{ defaultValues: props?.defaultValues, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}
