// src/pages/tasks/components/studentColumns.js
import { DataTableRowActions } from './data-table-row-actions' // Import the existing Row Actions component

export const studentColumns = [
  {
    id: 'sn', // Serial Number column
    header: 'S.N',
    cell: (info) => info.row.index + 1, // Serial number based on row index (1-based)
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'matric',
    header: 'Matric Number',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    id: 'actions', // Actions column for the three dots menu
    header: '',
    cell: ({ row }) => <DataTableRowActions row={row} />, // Use the existing DataTableRowActions component
    enableSorting: false,
    enableHiding: false,
  },
]
