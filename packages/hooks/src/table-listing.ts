import { Order } from '@repo/types/enums';
import { Status } from '@repo/types/models/enums';
import { useState } from 'react';
import { usePaginate } from './paginate';
import { sortArray } from '@repo/utilities/array';

export const useTableListing = (params: { list: any[] }) => {
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { items, activePage, setActivePage, totalPages, pageRange } =
    usePaginate(
      sortArray(params.list, (li) => li.created_at, Order.DESCENDING),
      15
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
