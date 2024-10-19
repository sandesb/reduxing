
// _components/contentColumns.jsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

// Define columns for DataTable
export const contentColumns = [
  {
    accessorKey: 'sn',
    header: 'SN',
    id: 'sn',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    id: 'name',
  },
  {
    accessorKey: 'matric',
    header: 'Matric',
    id: 'matric',
  },
  {
    accessorKey: 'studentName',
    header: 'Student',
    id: 'studentName',
  },
];
