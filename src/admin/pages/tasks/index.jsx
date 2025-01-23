import { useState } from 'react';
import { Layout } from '../../components/custom/layout';
import ThemeSwitch from '../../components/theme-switch';
import { UserNav } from '../../components/user-nav';
import { DataTable } from './components/data-table';
import { studentColumns } from './components/studentColumns';
import { useGetStudentsQuery } from '../../../redux/studentsApi'; // Assuming this is where you get students
import { Input } from '../../components/ui/input';

export default function StudentList() {
  const { data: students = [], isLoading, isError } = useGetStudentsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching student data!</p>;
  }

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.matric}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Layout.Header sticky>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Student List</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of students in the database.
            </p>
            <Input
            type="text"
            placeholder="Search by name or matric..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 mt-5 w-[200px] lg:w-[300px] rounded-md border border-gray-300 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          </div>
         
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable data={filteredStudents} columns={studentColumns} />
        </div>
      </Layout.Body>
    </Layout>
  );
}
