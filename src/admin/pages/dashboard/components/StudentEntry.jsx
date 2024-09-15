import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/custom/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { cn } from '../../../lib/utils';
import { useAddStudentMutation, useGetStudentByIdQuery, useUpdateStudentMutation } from '../../../../redux/studentsApi';

// Define form validation schema using Zod
const formSchema = z.object({
  matric: z.string().min(1, { message: 'Matric number is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  semester: z.number().min(1, { message: 'Semester is required and should be a number' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export function StudentEntry({ className, ...props }) {
  const { id } = useParams(); // Get the student ID from the route params
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize React Hook Form with Zod validation schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matric: '',
      name: '',
      semester: '',
      email: '',
    },
  });

  // Check if we are in "edit" mode by checking for an ID
  const isEditMode = !!id;

  // Fetch student data by ID if we are in "edit" mode
  const { data: studentData } = useGetStudentByIdQuery(id, { skip: !isEditMode });
  const [addStudent, { isSuccess, isError, error }] = useAddStudentMutation();

  const [updateStudent] = useUpdateStudentMutation();

  // Populate form with student data when in "edit" mode
  useEffect(() => {
    if (isEditMode && studentData) {
      form.reset({
        matric: studentData[0].matric,
        name: studentData[0].name,
        semester: studentData[0].semester,
        email: studentData[0].email,
      });
    }
  }, [isEditMode, studentData, form]);

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        // Update the student
        await updateStudent({ id, student: data }).unwrap();
        alert('Student data updated successfully!');
      } else {
        // Add new student
        await addStudent(data).unwrap();
        alert('Student data submitted successfully!');
      }
      navigate('/admin/tasks');
    } catch (err) {
      console.error('Failed to submit student data:', err);
      alert('Failed to submit student data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            {/* Matric Field */}
            <FormField
              control={form.control}
              name="matric"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Matric Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter matric number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Semester Field */}
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter semester number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button className="mt-2 w-full" loading={isLoading}>
              {isEditMode ? 'Update Student Data' : 'Submit Student Data'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Success/Error Message */}
      {isSuccess && <p className="text-green-500">{isEditMode ? 'Student updated successfully!' : 'Student added successfully!'}</p>}
      {isError && <p className="text-red-500">Error: {error?.data || 'Failed to add/update student'}</p>}
    </div>
  );
}
