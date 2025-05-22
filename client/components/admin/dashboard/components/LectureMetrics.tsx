'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LecturePerCourseData {
  courseId: string;
  courseName: string;
  lectureCount: number;
}

interface LectureStatusData {
  status: string;
  count: number;
}

interface LectureContentTypeData {
  type: string;
  count: number;
}

interface LectureMetricsProps {
  data: {
    lecturesPerCourse: LecturePerCourseData[];
    lectureStatusDistribution: LectureStatusData[];
    lectureContentTypes: LectureContentTypeData[];
  };
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
const STATUS_COLORS = {
  'draft': '#f59e0b',
  'published': '#10b981',
  'archived': '#6b7280'
};

const LectureMetrics: React.FC<LectureMetricsProps> = ({ data }) => {
  const formattedStatusData = data.lectureStatusDistribution.map(item => ({
    ...item,
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#6b7280'
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Lecture Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Lectures Per Course</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.lecturesPerCourse}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis
                  dataKey="courseName"
                  type="category"
                  width={80}
                  tick={props => {
                    const { x, y, payload } = props;
                    return (
                      <text x={x} y={y} dy={3} textAnchor="end" fill="#666" fontSize={12}>
                        {payload.value.length > 15 ? payload.value.substring(0, 15) + '...' : payload.value}
                      </text>
                    );
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${value} lectures`, 'Count']}
                  labelFormatter={(label) => `Course: ${label}`}
                />
                <Bar dataKey="lectureCount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {formattedStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} lectures`, props.payload.status]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Content Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.lectureContentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                  >
                    {data.lectureContentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} lectures`, props.payload.type]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureMetrics;
