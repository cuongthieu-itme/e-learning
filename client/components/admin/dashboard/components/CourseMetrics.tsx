'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface CourseSubjectData {
  subject: string;
  count: number;
}

interface CourseCreationData {
  date: string;
  count: number;
}

interface PublishStatusData {
  status: string;
  count: number;
}

interface CourseTopicsDistributionData {
  averageTopicsPerCourse: number;
  maxTopicsInCourse: number;
  minTopicsInCourse: number;
}

interface CourseMetricsProps {
  data: {
    coursesBySubject: CourseSubjectData[];
    courseCreationTrend: CourseCreationData[];
    publishStatus: PublishStatusData[];
    courseTopicsDistribution: CourseTopicsDistributionData;
  };
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6'];

const CourseMetrics: React.FC<CourseMetricsProps> = ({ data }) => {
  const formattedCreationTrend = data.courseCreationTrend.map(item => ({
    ...item,
    date: formatDateLabel(item.date)
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Thống kê khóa học</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Khóa học theo chủ đề</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.coursesBySubject}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="subject" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value} khóa học`, 'Số lượng']} />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Xu hướng tạo khóa học</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedCreationTrend} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} khóa học`, 'Số lượng']}
                  labelFormatter={(label) => `Giai đoạn: ${label}`}
                />
                <Bar dataKey="count" fill="#8b5cf6" name="Khóa học" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Phân bố trạng thái xuất bản</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.publishStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {data.publishStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} khóa học`, props.payload.status]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-xs font-medium text-slate-500">Số chủ đề trung bình mỗi khóa</h4>
            <p className="text-2xl font-bold mt-1">{data.courseTopicsDistribution.averageTopicsPerCourse}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-xs font-medium text-slate-500">Số chủ đề tối đa</h4>
            <p className="text-2xl font-bold mt-1">{data.courseTopicsDistribution.maxTopicsInCourse}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-xs font-medium text-slate-500">Số chủ đề tối thiểu</h4>
            <p className="text-2xl font-bold mt-1">{data.courseTopicsDistribution.minTopicsInCourse}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function formatDateLabel(dateString: string): string {
  const [year, month] = dateString.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

export default CourseMetrics;
