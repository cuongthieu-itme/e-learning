"use client";

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import { CourseQueryType, useCourseQuery } from '@/hooks/queries/useCourse.query';
import { ICourse } from '@/types';
import { ArrowRight, BookOpen, Bookmark, Layers, RefreshCw, Search, Star, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form/select';

// Extended course interface to include optional properties needed for UI
interface ExtendedCourse extends ICourse {
  imageUrl?: string;
  topics?: Array<{ _id: string; topic: string; courseId: string }>;
  price?: number;
}

// Interface for API response
interface CoursesResponse {
  statusCode: number;
  courses: ExtendedCourse[];
  totalCourses: number;
  totalPages: number;
  currentPage: number;
}

const CoursesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch courses data
  const { data, isLoading, error, refetch } = useCourseQuery({
    type: CourseQueryType.GET_ALL,
    params: {
      query: {
        page: currentPage,
        limit: 9,
        sort: sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(subjectFilter && { subject: subjectFilter })
      }
    }
  });

  // Extract courses and pagination info from response
  const courses = (data?.courses || []) as ExtendedCourse[];
  const totalCourses = data?.totalCourses || 0;
  const totalPages = data?.totalPages || 1;
  const hasError = !!error || !data;

  // Subject options based on available courses
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique subjects from courses
    if (data?.courses) {
      const subjects = data.courses
        .map(course => course.subject)
        .filter((subject, index, self) => subject && self.indexOf(subject) === index);
      
      setSubjectOptions(subjects);
    }
  }, [data]);

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      refetch();
    }, 500);

    setDebounceTimeout(timeout);
  };

  // Handle subject filter change
  const handleSubjectChange = (value: string) => {
    setSubjectFilter(value === 'all' ? '' : value);
    setCurrentPage(1);
    refetch();
  };

  // Handle sort order change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1);
    refetch();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
    // Scroll to top when page changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setSortOrder('desc');
    setCurrentPage(1);
    refetch();
  };

  // Render loading state
  if (isLoading && !data) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Tất cả khóa học</h1>
            <p className="text-gray-600">Khám phá các khóa học chất lượng của chúng tôi</p>
          </div>

          {/* Loading skeleton */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-xl bg-gray-200 shadow-md animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                  <div className="h-4 w-full bg-gray-300 rounded"></div>
                  <div className="h-4 w-full bg-gray-300 rounded"></div>
                  <div className="h-10 w-1/3 bg-gray-300 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.</p>
          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tất cả khóa học</h1>
          <p className="text-gray-600">Khám phá các khóa học chất lượng của chúng tôi</p>
        </div>

        {/* Search and filter section */}
        <div className="mb-8 grid gap-4 md:grid-cols-12">
          {/* Search box */}
          <div className="relative col-span-12 md:col-span-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Subject filter */}
          <div className="col-span-12 md:col-span-3">
            <Select value={subjectFilter === '' ? 'all' : subjectFilter} onValueChange={handleSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn học</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort order */}
          <div className="col-span-12 md:col-span-3">
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Mới nhất</SelectItem>
                <SelectItem value="asc">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset filters */}
          <div className="col-span-12 md:col-span-1">
            <Button 
              onClick={handleResetFilters} 
              variant="outline" 
              className="w-full h-full"
              title="Đặt lại bộ lọc"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-6 text-gray-600">
          <p>Hiển thị {courses.length} trong tổng số {totalCourses} khóa học</p>
        </div>

        {/* Courses grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses && courses.length > 0 ? courses.map((course) => (
            <div
              key={course._id}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
            >
              {/* Course image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <BookOpen className="h-16 w-16 text-white opacity-75" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                  {course.subject}
                </div>
              </div>

              {/* Course content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-1">{course.name}</h3>
                
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{course.description}</p>
                
                <div className="mt-auto space-y-3">
                  {/* Instructor */}
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="mr-2 h-4 w-4" />
                    <span>
                      {course.createdById && typeof course.createdById === 'object' && 
                       course.createdById.first_name && course.createdById.last_name
                        ? `${course.createdById.first_name} ${course.createdById.last_name}`
                        : 'Không xác định'}
                    </span>
                  </div>
                  
                  {/* Topics count */}
                  {course.topics && Array.isArray(course.topics) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Layers className="mr-2 h-4 w-4" />
                      <span>{course.topics.length} chủ đề</span>
                    </div>
                  )}
                  
                  {/* Price */}
                  {course.price !== undefined && (
                    <div className="flex items-center font-bold text-lg text-indigo-600">
                      {course.price === 0 
                        ? 'Miễn phí' 
                        : new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(course.price)}
                    </div>
                  )}
                  
                  {/* View details button */}
                  <Link
                    href={`/courses/${course._id}`}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    Xem chi tiết
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500">Không tìm thấy khóa học nào phù hợp</p>
              <Button 
                onClick={handleResetFilters} 
                variant="outline" 
                className="mt-4"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show limited page numbers for better UX
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className={currentPage === pageNumber ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                    >
                      {pageNumber}
                    </Button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber}>...</span>;
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
