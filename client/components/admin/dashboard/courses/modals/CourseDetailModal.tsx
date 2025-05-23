import { Book, Edit, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/buttons/button';
import { Badge } from '@/components/ui/info/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import { ICourse } from '@/types/course.types';

type CourseDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: ICourse | null;
};

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onOpenChange,
  course,
}) => {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden h-[calc(100vh-10rem)]">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center text-xl">
            <Book className="text-primary mr-2 h-5 w-5" />
            Chi tiết khóa học
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 overflow-y-auto max-h-[80vh]">
          <div className="bg-slate-50 rounded-lg p-5 my-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-slate-700 flex items-center">
                <span className="inline-flex justify-center items-center w-7 h-7 rounded-full bg-primary text-white font-semibold mr-2">T</span>
                Tên khóa học
              </h3>
              <Badge variant={course.isPublished ? "default" : "secondary"} className={course.isPublished ? "bg-green-500" : ""}>
                {course.isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
              </Badge>
            </div>
            <p className="text-base leading-relaxed pl-9">{course.name}</p>
          </div>

          <div className="my-6">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-primary rounded-full mr-2"></span>
              Môn học
            </h3>

            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-sm">{course.subject}</p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-blue-500 rounded-full mr-2"></span>
              Mô tả khóa học
            </h3>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <p className="text-sm whitespace-pre-line">{course.description}</p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-purple-500 rounded-full mr-2"></span>
              Người tạo
            </h3>

            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center">
                <User className="h-10 w-10 text-slate-400 bg-slate-100 p-2 rounded-full mr-3" />
                <div>
                  <p className="text-sm font-medium">
                    {course.createdById.first_name} {course.createdById.last_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">ID: {course.createdById._id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-slate-400 rounded-full mr-2"></span>
              Thông tin chi tiết
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 bg-slate-50 rounded-lg">
              {course.createdAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Ngày tạo</h4>
                  <p className="text-sm">{new Date(course.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              {course.updatedAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cập nhật cuối</h4>
                  <p className="text-sm">{new Date(course.updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end border-t pt-4 mt-2">
          <Link href={`/dashboard/courses/${course?._id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailModal;
