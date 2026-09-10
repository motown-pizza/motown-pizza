import React from 'react';
import { LayoutMain } from '@repo/ui';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { productsGet } from '@repo/handlers';
import { ProductGet } from '@repo/types';
import { API_URL } from '@repo/constants';

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
  const productId = (await params).productId;

  const { items: products }: { items: ProductGet[] } = await productsGet({ apiUrl: API_URL });
  const product = products.find((p) => p.id == productId);

  return {
    title: product?.title || 'New Product',
  };
};

export default function LayoutProduct({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
