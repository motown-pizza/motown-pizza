'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';
import FormProductVariant from '@/components/form/product-variant';
import { ProductVariantGet } from '@repo/types/models/product-variant';

export default function ProductVariant({
  props,
  children,
}: {
  props?: { defaultValues?: Partial<ProductVariantGet> };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        padding={0}
      >
        <LayoutModal
          props={{
            title: `${props?.defaultValues?.updated_at ? 'Edit' : 'Add'} Product Variant`,
            close,
          }}
        >
          <FormProductVariant
            props={{ defaultValues: props?.defaultValues, close }}
          />
        </LayoutModal>
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}
