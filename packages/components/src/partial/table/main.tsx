import React from 'react';
import {
  Center,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from '@mantine/core';
import SkeletonsTableRow from '../../common/skeletons/table-row';
import CheckboxTable from '../../common/checkboxes/table';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Main({
  children,
  props,
}: {
  children: React.ReactNode;
  props: {
    filteredItems?: any[] | null;
    rows: any[];
    selectedRows: any[];
    setSelectedRows: any;
    widths: any;
  };
}) {
  return (
    <Table>
      <TableThead>
        <TableTr
          bg={
            'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
          }
          c={'dimmed'}
          px={0}
        >
          <TableTh w={props.widths.selection} py={'sm'}>
            <CheckboxTable
              props={{
                list: props.filteredItems,
                rows: props.rows,
                selectedRows: props.selectedRows,
                setSelectedRows: props.setSelectedRows,
              }}
            />
          </TableTh>

          {children}
        </TableTr>
      </TableThead>

      <TableTbody>
        {props.filteredItems === undefined ? (
          <>
            <SkeletonsTableRow widths={props.widths} />
            <SkeletonsTableRow widths={props.widths} />
            <SkeletonsTableRow widths={props.widths} />
            <SkeletonsTableRow widths={props.widths} />
            <SkeletonsTableRow widths={props.widths} />
          </>
        ) : !props.rows.length ? (
          <TableTr>
            <TableTd colSpan={100}>
              <Center py={SECTION_SPACING * 2}>
                <Text ta={'center'} c={'dimmed'}>
                  No records found
                </Text>
              </Center>
            </TableTd>
          </TableTr>
        ) : (
          props.rows
        )}
      </TableTbody>
    </Table>
  );
}
