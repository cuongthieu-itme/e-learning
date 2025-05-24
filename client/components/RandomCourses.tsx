"use client";

import { CourseQueryType, useCourseQuery } from '@/hooks/queries/useCourse.query';
import { useAuthStore } from '@/store/auth.store';
import { ArrowRight, BookOpen, Bookmark, Layers, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CourseResponse {
  _id: string;
  name: string;
  description: string;
  subject: string;
  isPublished: boolean;
  createdById: string;
  instructor: {
    first_name: string;
    last_name: string;
  };
  topics: Array<{
    _id: string;
    topic: string;
    courseId: string;
  }>;
}

const RandomCourses = () => {
  const { data, isLoading, error } = useCourseQuery({
    type: CourseQueryType.GET_RANDOM,
    params: {}
  });
  
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const courses = data?.courses || [];
  const hasError = !!error || !data;

  const cardColors = [
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-purple-500 to-pink-400',
    'bg-gradient-to-br from-emerald-400 to-teal-600',
  ];

  const handleCourseClick = (courseId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Khóa học ngẫu nhiên</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Khóa học nổi bật</h2>
            <p className="text-gray-600">Khám phá các khóa học mới và thú vị</p>
          </div>
          <Link
            href="/courses"
            className="group mt-4 flex items-center text-indigo-600 hover:text-indigo-800 sm:mt-0"
          >
            <span className="font-medium">Xem tất cả</span>
            <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {courses && courses.length > 0 ? (courses as unknown as CourseResponse[]).map((course, index) => (
            <div
              key={course._id}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${cardColors[index % cardColors.length]}`}
              onClick={() => handleCourseClick(course._id)}
            >
              <div className="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>

              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                <div>
                  <div className="mb-2 flex items-center">
                    <Bookmark className="mr-2 h-5 w-5" />
                    <span className="text-sm font-medium">{course.subject}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{course.name}</h3>
                  <p className="mb-3 text-sm opacity-90 line-clamp-2">{course.description}</p>

                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 opacity-80" />
                    <p className="text-sm opacity-90">
                      {course.instructor.first_name} {course.instructor.last_name}
                    </p>
                  </div>

                  {course.topics && course.topics.length > 0 && (
                    <div className="mt-2 flex items-center">
                      <Layers className="mr-2 h-4 w-4 opacity-80" />
                      <p className="text-sm opacity-90">{course.topics.length} chủ đề</p>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <div className="mt-3 flex items-center text-yellow-300">
                      <Lock className="mr-2 h-4 w-4" />
                      <span className="text-sm">Yêu cầu đăng nhập để xem</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 inline-flex items-center text-sm font-semibold transition-all duration-300 group-hover:translate-x-1">
                  {!isAuthenticated ? (
                    <>
                      Đăng nhập để xem
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Xem chi tiết
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-500">Không có khóa học nào để hiển thị</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RandomCourses;
