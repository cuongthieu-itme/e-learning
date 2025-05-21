'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Edit } from 'lucide-react';
import { IQuestion } from '@/types/question.types';
import { Badge } from '@/components/ui/info/badge';
import { Button } from '@/components/ui/buttons/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/layout/dialog';

interface QuestionDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  question: IQuestion | null;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  isOpen,
  onOpenChange,
  question
}) => {
  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden h-[calc(100vh-10rem)]">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center text-xl">
            <AlertCircle className="text-primary mr-2 h-5 w-5" />
            Chi tiết câu hỏi
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 overflow-y-auto max-h-[80vh]">
          {/* Question Section */}
          <div className="bg-slate-50 rounded-lg p-5 my-4 shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium text-slate-700 mb-3 flex items-center">
              <span className="inline-flex justify-center items-center w-7 h-7 rounded-full bg-primary text-white font-semibold mr-2">?</span>
              Câu hỏi
            </h3>
            <p className="text-base leading-relaxed pl-9">{question.question}</p>
          </div>

          {/* Options Section */}
          <div className="my-6">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-primary rounded-full mr-2"></span>
              Các phương án trả lời
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
              {/* Option A */}
              <div className={`p-4 rounded-lg border ${question.correctAnswer === 'A'
                ? 'bg-green-50 border-green-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-start mb-2">
                  <span className={`inline-flex justify-center items-center w-6 h-6 rounded-full ${question.correctAnswer === 'A'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-700'} font-medium mr-2 text-sm`}>A</span>

                  <div className="flex-1">
                    <p className="text-sm">{question.optionA}</p>
                    {question.correctAnswer === 'A' && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600 bg-green-50">
                        Đáp án đúng
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Option B */}
              <div className={`p-4 rounded-lg border ${question.correctAnswer === 'B'
                ? 'bg-green-50 border-green-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-start mb-2">
                  <span className={`inline-flex justify-center items-center w-6 h-6 rounded-full ${question.correctAnswer === 'B'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-700'} font-medium mr-2 text-sm`}>B</span>

                  <div className="flex-1">
                    <p className="text-sm">{question.optionB}</p>
                    {question.correctAnswer === 'B' && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600 bg-green-50">
                        Đáp án đúng
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Option C */}
              <div className={`p-4 rounded-lg border ${question.correctAnswer === 'C'
                ? 'bg-green-50 border-green-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-start mb-2">
                  <span className={`inline-flex justify-center items-center w-6 h-6 rounded-full ${question.correctAnswer === 'C'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-700'} font-medium mr-2 text-sm`}>C</span>

                  <div className="flex-1">
                    <p className="text-sm">{question.optionC}</p>
                    {question.correctAnswer === 'C' && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600 bg-green-50">
                        Đáp án đúng
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Option D */}
              <div className={`p-4 rounded-lg border ${question.correctAnswer === 'D'
                ? 'bg-green-50 border-green-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-start mb-2">
                  <span className={`inline-flex justify-center items-center w-6 h-6 rounded-full ${question.correctAnswer === 'D'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-700'} font-medium mr-2 text-sm`}>D</span>

                  <div className="flex-1">
                    <p className="text-sm">{question.optionD}</p>
                    {question.correctAnswer === 'D' && (
                      <Badge variant="outline" className="mt-2 border-green-500 text-green-600 bg-green-50">
                        Đáp án đúng
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Section */}
          {question.explanation && (
            <div className="my-6 border-t pt-4">
              <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
                <span className="inline-block w-1 h-5 bg-yellow-400 rounded-full mr-2"></span>
                Giải thích đáp án
              </h3>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-slate-700">{question.explanation}</p>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
              <span className="inline-block w-1 h-5 bg-slate-400 rounded-full mr-2"></span>
              Thông tin chi tiết
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 bg-slate-50 rounded-lg">
              {/* Lecture Info */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Bài giảng</h4>
                {typeof question.lectureId === 'object' ? (
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-sm font-medium">{question.lectureId.title}</p>
                    <p className="text-xs text-slate-500 mt-1">ID: {question.lectureId._id}</p>
                  </div>
                ) : (
                  <p className="text-sm">{question.lectureId}</p>
                )}
              </div>

              {/* Creator Info */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Người tạo</h4>
                {typeof question.createdById === 'object' ? (
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-sm font-medium">
                      {question.createdById.first_name} {question.createdById.last_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">ID: {question.createdById._id}</p>
                  </div>
                ) : (
                  <p className="text-sm">{question.createdById}</p>
                )}
              </div>

              {/* Creation Date */}
              {question.createdAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Ngày tạo</h4>
                  <p className="text-sm">{new Date(question.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              {/* Last Update */}
              {question.updatedAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cập nhật cuối</h4>
                  <p className="text-sm">{new Date(question.updatedAt).toLocaleDateString('vi-VN', {
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
          <Link href={`/dashboard/questions/${question?._id}/edit`}>
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

export default QuestionDetailModal;
