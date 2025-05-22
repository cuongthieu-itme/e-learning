'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface UserGrowthData {
  date: string;
  count: number;
}

interface RoleDistributionData {
  role: string;
  count: number;
}

interface UserMetricsProps {
  data: {
    userGrowth: UserGrowthData[];
    roleDistribution: RoleDistributionData[];
  };
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const UserMetrics: React.FC<UserMetricsProps> = ({ data }) => {
  const formattedUserGrowth = data.userGrowth.map(item => ({
    ...item,
    date: formatDateLabel(item.date)
  }));

  const formattedRoleData = data.roleDistribution.map(item => ({
    ...item,
    role: item.role.charAt(0).toUpperCase() + item.role.slice(1)
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>User Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">User Growth Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedUserGrowth} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} users`, 'Count']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Role Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="role"
                  label={({ role, count }) => `${role}: ${count}`}
                >
                  {formattedRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} users`, props.payload.role]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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

export default UserMetrics;
