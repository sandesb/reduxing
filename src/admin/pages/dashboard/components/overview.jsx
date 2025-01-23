import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useGetAllContentQuery } from '../../../../redux/contentAdminApi';
export function Overview() {
  const { data, error, isLoading } = useGetAllContentQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  // Process data to count frequency of 'matric'
  const matricCount = {};
  data.forEach((item) => {
    const key = item.matric || 'Unknown'; // Handle NULL values
    matricCount[key] = (matricCount[key] || 0) + 1;
  });

  // Convert to chart-compatible format
  const chartData = Object.keys(matricCount).map((key) => ({
    name: key,
    total: matricCount[key],
  }));

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
