'use client';

import { Order } from '@repo/types';
import { Status } from '@repo/types';
import { useState } from 'react';
import { usePaginate } from './paginate';
import { sortArray } from '@repo/utils';

export const useTableListing = (params: { list: any[] }) => {
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { items, activePage, setActivePage, totalPages, pageRange } = usePaginate(
    sortArray(params.list, (li) => li.createdAt, Order.DESCENDING),
    15,
  );

  const anyActive = selectedRows?.find((iid) => {
    return params.list?.find((li) => li.id == iid)?.status == Status.ACTIVE;
  });

  const anyDraft = selectedRows?.find((iid) => {
    return params.list?.find((li) => li.id == iid)?.status == Status.DRAFT;
  });

  return {
    search,
    setSearch,
    selectedRows,
    setSelectedRows,
    items,
    activePage,
    setActivePage,
    totalPages,
    pageRange,
    anyActive,
    anyDraft,
  };
};
