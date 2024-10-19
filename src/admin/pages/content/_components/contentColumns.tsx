// _components/contentColumns.jsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Define columns for DataTable
export const contentColumns = [
  {
    accessorKey: 'sn',
    header: 'SN',
    id: 'sn',
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const content_id = row.original.content_id; // Get content_id from the row
      const matric = row.original.matric; // Get the matric from the row data

      return (
        <span
          onClick={() => navigate(`/admin/content/compare?content_id=${content_id}&matric=${matric}`)} // Navigate with content_id and matric
          className="cursor-pointer"
        >
          {row.original.name} {/* Display the name */}
        </span>
      );
    },
  },
  {
    accessorKey: 'matric',
    header: 'Matric',
    id: 'matric',
  },
  {
    accessorKey: 'studentName',
    header: 'User',
    id: 'studentName',
  },
];
