import { Delete, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';

import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
import { Badge } from '@/components/ui/info/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/layout/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/utilities/table';
import { LectureMutationType, useLectureMutation } from '@/hooks/mutations/useLecture.mutation';
import { formatDate } from '@/lib/utils';
import { ILecture } from '@/types/lecture.types';
import { LectureStatus } from '@/types/shared.types';
import LectureDetailModal from './modals/LectureDetailModal';

type DashboardLecturesListProps = {
  lecturesData: { lectures: ILecture[]; totalLectures: number };
};

const DashboardLecturesList: React.FC<DashboardLecturesListProps> = ({
  lecturesData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');
  const [selectedLecture, setSelectedLecture] = useState<ILecture | null>(null);
  const { toast } = useToast();

  const lectureMutation = useLectureMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['lectures'] });

      setIsDialogOpen(false);
      setSelectedLectureId('');

      toast({
        title: `Thành công 🚀`,
        description: response.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: LectureStatus) => {
    switch (status) {
      case LectureStatus.PUBLISHED:
        return <Badge variant="default" className='bg-green-500'>{getLabel(status)}</Badge>;
      case LectureStatus.DRAFT:
        return <Badge variant="secondary" className='bg-yellow-500'>{getLabel(status)}</Badge>;
      case LectureStatus.ARCHIVED:
        return <Badge variant="destructive" className='bg-red-500'>{getLabel(status)}</Badge>;
      default:
        return <Badge className='bg-gray-500'>{getLabel(status)}</Badge>;
    }
  };

  const getLabel = (status: LectureStatus) => {
    switch (status) {
      case LectureStatus.PUBLISHED:
        return 'Đã xuất bản';
      case LectureStatus.DRAFT:
        return 'Bản nháp';
      case LectureStatus.ARCHIVED:
        return 'Đã lưu trữ';
      default:
        return status;
    }
  };

  return (
    <Table>
      <TableCaption>Danh sách các bài giảng</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            '#',
            'Tiêu đề',
            'Nội dung',
            'Người tạo',
            'Trạng thái',
            'Ngày tạo',
            'Hành động',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {lecturesData.lectures.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>Không tìm thấy bài giảng</TableCell>
          </TableRow>
        ) : (
          lecturesData.lectures.map((lecture, index) => (
            <TableRow
              className="whitespace-nowrap cursor-pointer hover:bg-slate-50"
              key={lecture._id}
              onClick={() => {
                setSelectedLecture(lecture);
                setIsDetailDialogOpen(true);
              }}
            >
              <TableCell className="max-w-[120px] truncate">{index + 1}</TableCell>
              <TableCell className="max-w-[300px] truncate">{lecture.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">{lecture.content}</TableCell>
              <TableCell>{`${lecture.createdById?.first_name} ${lecture.createdById?.last_name}`}</TableCell>
              <TableCell>{getStatusBadge(lecture.status)}</TableCell>
              <TableCell>{formatDate(new Date(lecture.createdAt || ''))}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/lectures/${lecture._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => {
                        setSelectedLectureId(lecture._id);
                        setIsDialogOpen(true);
                      }}>
                        <Delete className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Tổng</TableCell>
          <TableCell className="text-right">
            {lecturesData.totalLectures}
          </TableCell>
        </TableRow>
      </TableFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài giảng này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={lectureMutation.status === 'pending'}
              onClick={() =>
                lectureMutation.mutate({
                  type: LectureMutationType.DELETE,
                  lectureId: selectedLectureId,
                })
              }
            >
              {lectureMutation.status === 'pending' ? (
                <Loader type="ScaleLoader" height={20} />
              ) : (
                'Xác nhận'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LectureDetailModal
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        lecture={selectedLecture}
      />
    </Table>
  );
};

export default DashboardLecturesList;
