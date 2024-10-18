import { Layout } from '../../components/custom/layout';
import { Button } from '../../components/custom/button';
import { useState } from 'react';
import {
  Cardy,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import Card from '../../../components/Card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ThemeSwitch from '../../components/theme-switch';
import { TopNav } from '../../components/top-nav';
import { UserNav } from '../../components/user-nav';
import { RecentSales } from './components/recent-sales';
import { Overview } from './components/overview';
import { UserAuthForm } from '../auth/components/user-auth-form';
import { StudentEntry } from './components/StudentEntry';
import AddCart from '../../../components/AddCart';
import {
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../../../redux/subjectsApi';
import DeleteDialog from '../../../components/DeleteDialog';
import ItemDialog from '../../../components/ItemDialog';

export default function Dashboard() {
  const { data: courses = [], error, isLoading, refetch } = useGetCoursesQuery();

  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = async (updatedCourse) => {
    try {
      console.log('Updating course:', updatedCourse);

      const { data, error } = await updateCourse(updatedCourse).unwrap();

      if (error) throw error;

      console.log('Course updated successfully:', data);

      refetch(); // Refetch courses to reflect the update
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedCourseId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(selectedCourseId).unwrap();
      console.log('Deleted course with id:', selectedCourseId);
      setDeleteDialogOpen(false);

      refetch();
    } catch (error) {
      console.error('Failed to delete course:', error);
      showToast('error', 'Failed to delete course. Please try again.');
    }
  };

  const handleTitleClick = (id) => {
    const selectedCourse = courses.find((course) => course.id === id);
    if (selectedCourse) {
      setSelectedItem(selectedCourse);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Static Cards */}
              <Cardy>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Cardy>
              {/* Other static cards here */}
              <Cardy>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Cardy>

                <Cardy>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Cardy>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Cardy className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Cardy>
              <Cardy className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>All Students</CardTitle>
                  <CardDescription>
                    Virinchi students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Cardy>
            </div>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <AddCart />
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {courses.map((course) => (
                <Cardy key={course.id}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      {course.title}
                    </CardTitle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      className='h-4 w-4 text-muted-foreground'
                    >
                      <path d={course.icon} /> {/* Assuming icon is an SVG path */}
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{course.icon}</div>
                    <p className='text-xs text-muted-foreground'>
                      Chapters: {course.progress}
                    </p>
                  </CardContent>
                </Cardy>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='reports' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Cardy>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    User Authentication
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    {/* Your icon here */}
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-md font-medium'>
                    Please login to access the reports dashboard.
                  </div>
                </CardContent>
              </Cardy>
            </div>
            <div className='mt-6'>
              <StudentEntry />
            </div>
          </TabsContent>



 {/* ===== Notifications Tab ===== */}
          <TabsContent value='notifications' className='space-y-4'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Notifications</h2>
                <p className='text-muted-foreground'>
                  Here's a list of your courses.
                </p>
              </div>
              <AddCart refetch={refetch} />
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {courses
                .slice()
                .reverse()
                .map((course) => (
                  <Card
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    progress={course.progress}
                    icon={course.icon}
                    bgColor={course.bgColor}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    onTitleClick={handleTitleClick}
                  />
                ))}
            </div>
            {/* ItemDialog to show details and edit notes */}
            {selectedItem && (
              <ItemDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                item={selectedItem}
              />
            )}
            {/* Render DeleteDialog */}
            <DeleteDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  );
}
const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  }
];
