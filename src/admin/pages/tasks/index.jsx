import { Layout } from '../../components/custom/layout';
import ThemeSwitch from '../../components/theme-switch';
import { UserNav } from '../../components/user-nav';
import { DataTable } from './components/data-table';
import { studentColumns } from './components/studentColumns';
import { useGetStudentsQuery } from '../../../redux/studentsApi'; // Assuming this is where you get students

export default function StudentList() {
  const { data: students = [], isLoading, isError } = useGetStudentsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching student data!</p>;
  }

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
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable data={students} columns={studentColumns} />
        </div>
      </Layout.Body>
    </Layout>
  );
}
