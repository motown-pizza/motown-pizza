import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { productsGet } from '@repo/handlers/requests/database/products';
import { ProductGet } from '@repo/types/models/product';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const productId = (await params).productId;

  const { items: products }: { items: ProductGet[] } = await productsGet();
  const product = products.find((p) => p.id == productId);

  return {
    title: product?.title || 'New Item',
  };
};

export default function LayoutProduct({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
