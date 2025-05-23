import { AlertCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/buttons/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import { ICourseTopic } from '@/types/course-topic.types';

type CourseTopicDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseTopic: ICourseTopic | null;
};

const CourseTopicDetailModal: React.FC<CourseTopicDetailModalProps> = ({
  isOpen,
  onOpenChange,
  courseTopic,
}) => {
  if (!courseTopic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden h-[calc(100vh-10rem)]">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center text-xl">
            <AlertCircle className="text-primary mr-2 h-5 w-5" />
            Chi tiết chủ đề khóa học
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 overflow-y-auto max-h-[80vh]">
          <div className="bg-slate-50 rounded-lg p-5 my-4 shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium text-slate-700 mb-3 flex items-center">
              <span className="inline-flex justify-center items-center w-7 h-7 rounded-full bg-primary text-white font-semibold mr-2">T</span>
              Chủ đề
            </h3>
            <p className="text-base leading-relaxed pl-9">{courseTopic.topic}</p>
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-slate-400 rounded-full mr-2"></span>
              Thông tin chi tiết
            </h3>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Khóa học</h4>
                {typeof courseTopic.courseId === 'object' ? (
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-sm font-medium">{courseTopic.courseId.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Môn học: {courseTopic.courseId.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">ID: {courseTopic.courseId._id}</p>
                  </div>
                ) : (
                  <p className="text-sm">{courseTopic.courseId}</p>
                )}
              </div>

              {courseTopic.createdAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Ngày tạo</h4>
                  <p className="text-sm">{new Date(courseTopic.createdAt.toString()).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              {courseTopic.updatedAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cập nhật cuối</h4>
                  <p className="text-sm">{new Date(courseTopic.updatedAt.toString()).toLocaleDateString('vi-VN', {
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
          <Link href={`/dashboard/course-topics/${courseTopic?._id}/edit`}>
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

export default CourseTopicDetailModal;
