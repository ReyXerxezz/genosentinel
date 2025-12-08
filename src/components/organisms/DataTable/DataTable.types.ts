import { type ReactNode } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (id: number | string) => void;
}