"use client";

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import { CourseTopicQueryType, useCourseTopicQuery } from '@/hooks/queries/useCourseTopic.query';
import { ArrowRight, BookOpen, Bookmark, RefreshCw, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface for topic item from API
interface CourseTopicResponse {
  _id: string;
  courseId: string | { _id: string; name: string };
  topic: string;
  course: {
    name: string;
    subject: string;
  };
}

// Interface for response of API
interface TopicsResponse {
  statusCode: number;
  courseTopics: CourseTopicResponse[];
  totalTopics: number;
  totalPages: number;
  currentPage: number;
}

const TopicsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch topics data
  const { data, isLoading, error, refetch } = useCourseTopicQuery({
    type: CourseTopicQueryType.GET_ALL,
    params: {
      query: {
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm })
      }
    }
  });

  // Extract topics and pagination info from response
  const topics = data?.courseTopics || [];
  // Calculate total pages based on total topics and limit
  const totalTopics = data?.totalCourseTopics || 0;
  const pageSize = 12; // Same as limit in the query
  const totalPages = Math.ceil(totalTopics / pageSize);
  const hasError = !!error || !data;

  // Background gradient colors for cards
  const cardColors = [
    'bg-gradient-to-br from-blue-600 to-indigo-700',
    'bg-gradient-to-br from-purple-600 to-pink-500',
    'bg-gradient-to-br from-emerald-500 to-teal-700',
    'bg-gradient-to-br from-orange-500 to-amber-600',
    'bg-gradient-to-br from-rose-500 to-red-700',
    'bg-gradient-to-br from-cyan-500 to-blue-700',
  ];

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

  // Render loading state
  if (isLoading && !data) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Tất cả chủ đề</h2>
            <p className="text-gray-600">Khám phá đa dạng chủ đề học tập</p>
          </div>

          {/* Loading skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 8, 9].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tất cả chủ đề</h2>
          <p className="text-gray-600">Khám phá đa dạng chủ đề học tập</p>
        </div>

        {/* Search and filter */}
        <div className="mb-8 grid gap-4 md:flex md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm chủ đề..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
              refetch();
            }}
            title="Đặt lại bộ lọc"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Error state */}
        {hasError && (
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-red-600">Không thể tải dữ liệu chủ đề. Vui lòng thử lại sau.</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Topics grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topics && topics.length > 0 ? (topics as unknown as CourseTopicResponse[]).map((topic, index) => (
            <div
              key={topic._id}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] ${cardColors[index % cardColors.length]}`}
            >
              <div className="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>

              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                <div>
                  <div className="mb-2 flex items-center">
                    <Bookmark className="mr-2 h-5 w-5" />
                    <span className="text-sm font-medium">{topic.course?.subject || 'Không có môn học'}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{topic.topic || 'Không có chủ đề'}</h3>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 opacity-80" />
                    <p className="text-sm opacity-90">{topic.course?.name || 'Không có khóa học'}</p>
                  </div>
                </div>

                <Link
                  href={`/courses/${(typeof topic.courseId === 'object' && topic.courseId && '_id' in topic.courseId) ? topic.courseId._id : (topic.courseId || '')}/topics/${topic._id || ''}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold transition-all duration-300 hover:translate-x-1"
                >
                  Xem chi tiết
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">Không tìm thấy chủ đề nào phù hợp</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
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

export default TopicsList;
