'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { ArrowUp, Book, BookOpen, CheckCircle, FileText, Users } from 'lucide-react';

interface OverviewData {
  totalUsers: number;
  usersThisMonth: number;
  totalCourses: number;
  coursesThisMonth: number;
  totalLectures: number;
  lecturesThisMonth: number;
  totalQuestions: number;
  questionsThisMonth: number;
  publishedCourses?: number;
  completedLectures?: number;
}

interface OverviewStatsProps {
  data: OverviewData;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => {
  // Ensure all values are valid numbers
  const safeData = {
    totalUsers: data?.totalUsers ?? 0,
    usersThisMonth: data?.usersThisMonth ?? 0,
    totalCourses: data?.totalCourses ?? 0,
    coursesThisMonth: data?.coursesThisMonth ?? 0,
    totalLectures: data?.totalLectures ?? 0,
    lecturesThisMonth: data?.lecturesThisMonth ?? 0,
    totalQuestions: data?.totalQuestions ?? 0,
    questionsThisMonth: data?.questionsThisMonth ?? 0,
  };

  const statCards = [
    {
      title: 'Tổng số người dùng',
      value: safeData.totalUsers,
      thisMonth: safeData.usersThisMonth,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50',
      percent: data?.publishedCourses ? Math.round((data.publishedCourses / safeData.totalUsers) * 100) : undefined,
    },
    {
      title: 'Tổng số khóa học',
      value: safeData.totalCourses,
      thisMonth: safeData.coursesThisMonth,
      icon: <Book className="h-5 w-5 text-emerald-600" />,
      color: 'bg-emerald-50',
      percent: data?.publishedCourses ? Math.round((data.publishedCourses / safeData.totalCourses) * 100) : undefined,
    },
    {
      title: 'Tổng số bài giảng',
      value: safeData.totalLectures,
      thisMonth: safeData.lecturesThisMonth,
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50',
      percent: data?.completedLectures ? Math.round((data.completedLectures / safeData.totalLectures) * 100) : undefined,
    },
    {
      title: 'Tổng số câu hỏi',
      value: safeData.totalQuestions,
      thisMonth: safeData.questionsThisMonth,
      icon: <FileText className="h-5 w-5 text-amber-600" />,
      color: 'bg-amber-50',
      percent: undefined,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.color}`}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{String(stat.value)}</div>
            {stat.thisMonth !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                <span>{String(stat.thisMonth)} mới trong tháng này</span>
              </p>
            )}
            {stat.percent !== undefined && (
              <p className="text-xs text-muted-foreground">
                {String(stat.percent)}% trên tổng số
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewStats;
