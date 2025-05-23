"use client";

import { CourseTopicQueryType, useCourseTopicQuery } from '@/hooks/queries/useCourseTopic.query';
import { ArrowRight, BookOpen, Bookmark } from 'lucide-react';
import Link from 'next/link';

interface CourseTopicResponse {
  _id: string;
  courseId: string;
  topic: string;
  course: {
    name: string;
    subject: string;
  };
}

const RandomTopics = () => {
  const { data, isLoading, error } = useCourseTopicQuery({
    type: CourseTopicQueryType.GET_RANDOM,
    params: {}
  });

  const topics = data?.courseTopics || [];
  const hasError = !!error || !data;

  const cardColors = [
    'bg-gradient-to-br from-blue-600 to-indigo-700',
    'bg-gradient-to-br from-purple-600 to-pink-500',
    'bg-gradient-to-br from-emerald-500 to-teal-700',
  ];

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Chủ đề nổi bật</h2>
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
          <p className="text-center text-red-500">Không thể tải dữ liệu chủ đề. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Chủ đề nổi bật</h2>
            <p className="text-gray-600">Khám phá các chủ đề học tập được nhiều người quan tâm</p>
          </div>
          <Link
            href="/topics"
            className="group mt-4 flex items-center text-indigo-600 hover:text-indigo-800 sm:mt-0"
          >
            <span className="font-medium">Xem tất cả</span>
            <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {topics && topics.length > 0 ? (topics as unknown as CourseTopicResponse[]).map((topic, index) => (
            <div
              key={topic._id}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${cardColors[index % cardColors.length]}`}
            >
              <div className="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>

              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                <div>
                  <div className="mb-2 flex items-center">
                    <Bookmark className="mr-2 h-5 w-5" />
                    <span className="text-sm font-medium">{topic.course.subject}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{topic.topic}</h3>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 opacity-80" />
                    <p className="text-sm opacity-90">{topic.course.name}</p>
                  </div>
                </div>

                <Link
                  href={`/courses/${topic.courseId}/topics/${topic._id}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold transition-all duration-300 hover:translate-x-1"
                >
                  Xem chi tiết
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-500">Không có chủ đề nào để hiển thị</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RandomTopics;
