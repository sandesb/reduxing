import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { useGetStudentsQuery } from '../../../../redux/studentsApi';
export function RecentSales() {
  const { data: students, error, isLoading } = useGetStudentsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading students</div>;
  }

  return (
    <div className="space-y-8">
      {students?.map((student) => (
        <div key={student.matric} className="flex items-center">
          {/* Avatar component */}
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt={`${student.name}'s Avatar`} />
            <AvatarFallback>{student.semester}</AvatarFallback> {/* Display semester in place of initials */}
          </Avatar>

          {/* Student details */}
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{student.name}</p>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>

          {/* Display matric number in place of price */}
          <div className="ml-auto font-medium">{student.matric}</div>
        </div>
      ))}
    </div>
  );
}
