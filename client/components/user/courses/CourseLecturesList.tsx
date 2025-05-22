"use client";

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import { getCourseLectures } from '@/lib/actions/lecture.actions';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Book, BookOpen, Clock, FileText, RefreshCw, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Instructor {
  _id: string;
  first_name: string;
  last_name: string;
}

interface CourseInfo {
  _id: string;
  name: string;
  subject: string;
}

interface Lecture {
  _id: string;
  title: string;
  content: string;
  outline: string;
  pptxUrl?: string;
  mindmapUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  courseId: CourseInfo;
  createdById: Instructor;
}

interface LecturesResponse {
  statusCode: number;
  lectures: Lecture[];
  totalLectures: number;
  currentPage: number;
  totalPages: number;
}

interface CourseLecturesListProps {
  courseId: string;
}

const CourseLecturesList = ({ courseId }: CourseLecturesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lecturesData, setLecturesData] = useState<LecturesResponse | null>(null);

  const fetchLectures = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '10');
      if (search) {
        queryParams.append('search', search);
      }

      const response = await getCourseLectures(courseId, queryParams.toString());
      setLecturesData({
        statusCode: response.statusCode,
        lectures: response.lectures as unknown as Lecture[],
        totalLectures: response.totalLectures,
        currentPage: response.currentPage,
        totalPages: response.totalPages
      });
    } catch (err) {
      setError('Không thể tải dữ liệu bài giảng. Vui lòng thử lại sau.');
      console.error('Error fetching lectures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures(currentPage, searchTerm);
  }, [courseId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchLectures(1, value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLectures(page, searchTerm);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (isLoading && !lecturesData) {
    return (
      <div className="py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Danh sách bài giảng</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 p-4">
              <div className="h-6 w-3/4 rounded bg-gray-200"></div>
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="mt-4 flex justify-between">
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="mb-4 text-red-500">{error}</p>
        <Button
          onClick={() => fetchLectures(currentPage, searchTerm)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  const lectures = lecturesData?.lectures || [];
  const totalPages = lecturesData?.totalPages || 1;

  return (
    <div className="py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-gray-800">Danh sách bài giảng</h2>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm bài giảng..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p>Hiển thị {lectures.length} trong tổng số {lecturesData?.totalLectures || 0} bài giảng</p>
      </div>

      {lectures.length > 0 ? (
        <div className="space-y-4">
          {lectures.map((lecture) => (
            <div
              key={lecture._id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="p-5">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">{lecture.title}</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {lecture.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>

                <div className="mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Khóa học: {lecture.courseId.name}</span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Ngày tạo: {formatDate(new Date(lecture.createdAt))}</span>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                  {lecture.pptxUrl && (
                    <a
                      href={lecture.pptxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Slide bài giảng
                    </a>
                  )}

                  {lecture.mindmapUrl && (
                    <a
                      href={lecture.mindmapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Sơ đồ tư duy
                    </a>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Book className="mr-1 h-4 w-4" />
                    <span>
                      Người hướng dẫn: {lecture.createdById.first_name} {lecture.createdById.last_name}
                    </span>
                  </div>

                  <Link
                    href={`/lectures/${lecture._id}`}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    Xem chi tiết
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">Không có bài giảng nào</p>
          {searchTerm && (
            <Button
              onClick={() => {
                setSearchTerm('');
                fetchLectures(1, '');
              }}
              variant="outline"
              className="mt-4"
            >
              Xóa tìm kiếm
            </Button>
          )}
        </div>
      )}

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
  );
};

export default CourseLecturesList;
