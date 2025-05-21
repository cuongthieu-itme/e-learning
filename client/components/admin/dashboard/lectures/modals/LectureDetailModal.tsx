import { AlertCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/info/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import { Separator } from '@/components/ui/layout/separator';
import { Button } from '@/components/ui/buttons/button';
import { ILecture } from '@/types/lecture.types';
import { LectureStatus } from '@/types/shared.types';

type LectureDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lecture: ILecture | null;
};

const LectureDetailModal: React.FC<LectureDetailModalProps> = ({
  isOpen,
  onOpenChange,
  lecture,
}) => {
  if (!lecture) return null;

  const getStatusBadge = (status: LectureStatus) => {
    switch (status) {
      case LectureStatus.PUBLISHED:
        return <Badge className="bg-green-500">Đã đăng</Badge>;
      case LectureStatus.DRAFT:
        return <Badge variant="secondary">Bản nháp</Badge>;
      case LectureStatus.ARCHIVED:
        return <Badge variant="destructive">Đã lưu trữ</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden h-[calc(100vh-10rem)]">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center text-xl">
            <AlertCircle className="text-primary mr-2 h-5 w-5" />
            Chi tiết bài giảng
          </DialogTitle>
        </DialogHeader>

        {lecture && (
          <div className="py-2 overflow-y-auto max-h-[80vh]">
            {/* Title Section */}
            <div className="bg-slate-50 rounded-lg p-5 my-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-slate-700 flex items-center">
                  <span className="inline-flex justify-center items-center w-7 h-7 rounded-full bg-primary text-white font-semibold mr-2">T</span>
                  Tiêu đề
                </h3>
                {getStatusBadge(lecture.status)}
              </div>
              <p className="text-base leading-relaxed pl-9">{lecture.title}</p>
            </div>
            
            {/* Content Section */}
            <div className="my-6">
              <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
                <span className="inline-block w-1 h-5 bg-primary rounded-full mr-2"></span>
                Nội dung
              </h3>
              
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <p className="text-sm whitespace-pre-line">{lecture.content}</p>
              </div>
            </div>

            {/* Outline Section */}
            <div className="my-6">
              <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
                <span className="inline-block w-1 h-5 bg-blue-500 rounded-full mr-2"></span>
                Đề cương
              </h3>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-sm whitespace-pre-line">{lecture.outline}</p>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="my-6">
              <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
                <span className="inline-block w-1 h-5 bg-purple-500 rounded-full mr-2"></span>
                Tài nguyên bổ sung
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                {/* PPTX Resources */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <h4 className="font-medium text-sm mb-2 text-slate-700">Bài trình bày PowerPoint</h4>
                  {lecture.pptxUrl ? (
                    <div className="flex items-center">
                      <Link href={lecture.pptxUrl} target="_blank" className="text-primary hover:underline text-sm overflow-hidden overflow-ellipsis">
                        {lecture.pptxUrl}
                      </Link>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic">Không có tài liệu PowerPoint</p>
                  )}
                </div>

                {/* Mindmap Resources */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <h4 className="font-medium text-sm mb-2 text-slate-700">Sơ đồ tư duy</h4>
                  {lecture.mindmapUrl ? (
                    <div className="flex items-center">
                      <Link href={lecture.mindmapUrl} target="_blank" className="text-primary hover:underline text-sm overflow-hidden overflow-ellipsis">
                        {lecture.mindmapUrl}
                      </Link>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic">Không có sơ đồ tư duy</p>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
                <span className="inline-block w-1 h-5 bg-slate-400 rounded-full mr-2"></span>
                Thông tin chi tiết
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 bg-slate-50 rounded-lg">
                {/* Course Info */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Khóa học</h4>
                  {typeof lecture.courseId === 'object' ? (
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <p className="text-sm font-medium">{lecture.courseId.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Môn học: {lecture.courseId.subject}</p>
                      <p className="text-xs text-slate-500 mt-1">ID: {lecture.courseId._id}</p>
                    </div>
                  ) : (
                    <p className="text-sm">{lecture.courseId}</p>
                  )}
                </div>

                {/* Creator Info */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Người tạo</h4>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-sm font-medium">
                      {lecture.createdById.first_name} {lecture.createdById.last_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">ID: {lecture.createdById._id}</p>
                  </div>
                </div>
                
                {/* Creation Date */}
                {lecture.createdAt && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Ngày tạo</h4>
                    <p className="text-sm">{new Date(lecture.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                )}
                
                {/* Last Update */}
                {lecture.updatedAt && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cập nhật cuối</h4>
                    <p className="text-sm">{new Date(lecture.updatedAt).toLocaleDateString('vi-VN', {
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
        )}

        <DialogFooter className="flex gap-2 justify-end border-t pt-4 mt-2">
          <Link href={`/dashboard/lectures/${lecture?._id}/edit`}>
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

export default LectureDetailModal;
