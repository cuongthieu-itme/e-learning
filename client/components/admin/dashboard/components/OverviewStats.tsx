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
  publishedCourses: number;
  completedLectures: number;
}

interface OverviewStatsProps {
  data: OverviewData;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => {
  const statCards = [
    {
      title: 'Tổng số người dùng',
      value: data.totalUsers,
      thisMonth: data.usersThisMonth,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Tổng số khóa học',
      value: data.totalCourses,
      thisMonth: data.coursesThisMonth,
      icon: <Book className="h-5 w-5 text-emerald-600" />,
      color: 'bg-emerald-50',
    },
    {
      title: 'Tổng số bài giảng',
      value: data.totalLectures,
      thisMonth: data.lecturesThisMonth,
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50',
    },
    {
      title: 'Tổng số câu hỏi',
      value: data.totalQuestions,
      thisMonth: data.questionsThisMonth,
      icon: <FileText className="h-5 w-5 text-amber-600" />,
      color: 'bg-amber-50',
    },
    {
      title: 'Khóa học đã xuất bản',
      value: data.publishedCourses,
      percent: data.totalCourses > 0 ? Math.round((data.publishedCourses / data.totalCourses) * 100) : 0,
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Bài giảng đã hoàn thành',
      value: data.completedLectures,
      percent: data.totalLectures > 0 ? Math.round((data.completedLectures / data.totalLectures) * 100) : 0,
      icon: <CheckCircle className="h-5 w-5 text-indigo-600" />,
      color: 'bg-indigo-50',
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
