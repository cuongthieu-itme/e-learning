"use client";

import CourseLecturesList from '@/components/user/courses/CourseLecturesList';
import { CourseQueryType, useCourseQuery } from '@/hooks/queries/useCourse.query';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CourseDetailPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data, isLoading, error } = useCourseQuery({
    type: CourseQueryType.GET_ONE,
    params: { courseId }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-8 w-1/2 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4 text-red-500">Không thể tải thông tin khóa học. Vui lòng thử lại sau.</p>
        <Link
          href="/courses"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  const course = data.course as (typeof data.course & {
    imageUrl?: string;
    price?: number;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/courses"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách khóa học
        </Link>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-md">
        <div className="relative h-64 w-full bg-gradient-to-r from-indigo-600 to-purple-600">
          {'imageUrl' in course && course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{course.name}</h1>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{course.name}</h1>
                <p className="mt-2 text-white opacity-90">{course.subject}</p>
              </div>
              {'price' in course && course.price !== undefined && (
                <div className="rounded-lg bg-white bg-opacity-90 px-4 py-2 text-xl font-bold text-indigo-600">
                  {course.price === 0
                    ? 'Miễn phí'
                    : new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(course.price)
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600">
            {course.createdById && (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>
                  Giảng viên: {typeof course.createdById === 'object' &&
                    course.createdById.first_name &&
                    course.createdById.last_name ?
                    `${course.createdById.first_name} ${course.createdById.last_name}` :
                    'Không xác định'}
                </span>
              </div>
            )}

            {course.createdAt && (
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Ngày tạo: {formatDate(new Date(course.createdAt))}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Mô tả khóa học</h2>
            <div className="prose max-w-none text-gray-600">
              {course.description || 'Không có mô tả cho khóa học này.'}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <CourseLecturesList courseId={courseId} />
      </div>
    </div>
  );
};

export default CourseDetailPage;
