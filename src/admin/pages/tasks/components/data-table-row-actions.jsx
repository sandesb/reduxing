import { useNavigate } from 'react-router-dom';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '../../../components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '../../../components/ui/dropdown-menu';
import { useDeleteStudentMutation } from '../../../../redux/studentsApi';

export function DataTableRowActions({ row }) {
  const navigate = useNavigate();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleEdit = () => {
    console.log('Edit action triggered for student ID:', row.original.id);
    navigate(`/admin/student-edit/${row.original.id}`);
  };

  const handleDelete = async () => {
    console.log('Delete action initiated for student ID:', row.original.id);
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        // Trigger the delete mutation
        const result = await deleteStudent(row.original.id).unwrap();
        console.log(`Student with ID ${row.original.id} deleted successfully.`, result);
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-white">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
       
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
