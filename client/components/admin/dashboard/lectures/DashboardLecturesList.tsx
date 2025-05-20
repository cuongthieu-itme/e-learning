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
import { ILecture } from '@/types/lecture.types';
import { LectureStatus } from '@/types/shared.types';

type DashboardLecturesListProps = {
  lecturesData: { lectures: ILecture[]; totalLectures: number };
};

const DashboardLecturesList: React.FC<DashboardLecturesListProps> = ({
  lecturesData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');
  const { toast } = useToast();

  const lectureMutation = useLectureMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['lectures'] });

      setIsDialogOpen(false);
      setSelectedLectureId('');

      toast({
        title: `Success ${response.statusCode} 🚀`,
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
        return <Badge variant="default">{status}</Badge>;
      case LectureStatus.DRAFT:
        return <Badge variant="secondary">{status}</Badge>;
      case LectureStatus.ARCHIVED:
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableCaption>A list of your lectures</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            'ID',
            'Title',
            'Status',
            'Actions',
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
            <TableCell colSpan={4}>No lectures found</TableCell>
          </TableRow>
        ) : (
          lecturesData.lectures.map((lecture) => (
            <TableRow className="whitespace-nowrap" key={lecture._id}>
              <TableCell className="max-w-[120px] truncate">{lecture._id}</TableCell>
              <TableCell className="max-w-[300px] truncate">{lecture.title}</TableCell>
              <TableCell>{getStatusBadge(lecture.status)}</TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/lectures/${lecture._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Lecture
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => {
                        setSelectedLectureId(lecture._id);
                        setIsDialogOpen(true);
                      }}>
                        <Delete className="mr-2 h-4 w-4" />
                        Delete Lecture
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
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {lecturesData.totalLectures}
          </TableCell>
        </TableRow>
      </TableFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lecture</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to
              permanently delete this lecture from server?
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
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Table>
  );
};

export default DashboardLecturesList;
