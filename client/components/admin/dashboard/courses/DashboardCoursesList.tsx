'use client';

import { Book, Delete, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import {
  CourseMutationType,
  useCourseMutation,
} from '@/hooks/mutations/useCourse.mutation';
import { formatDate } from '@/lib/utils/date.utils';
import { ICourse } from '@/types';

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

type DashboardCoursesListProps = {
  coursesData: {
    courses: ICourse[];
    totalCourses: number;
    currentPage: number;
    totalPages: number;
  };
};

const DashboardCoursesList: React.FC<DashboardCoursesListProps> = ({
  coursesData,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const courseMutation = useCourseMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });

      setIsDialogOpen(false);

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

  const handleDeleteClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsDialogOpen(true);
  };

  return (
    <Table>
      <TableCaption>A list of your courses</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            '',
            'Id',
            'Name',
            'Description',
            'Subject',
            'Status',
            'Created By',
            'Created At',
            'Actions',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {coursesData.courses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9}>No courses found</TableCell>
          </TableRow>
        ) : (
          coursesData.courses.map((course) => (
            <TableRow className="whitespace-nowrap" key={course._id}>
              <TableCell>
                <Book className="h-8 w-8 text-primary" />
              </TableCell>
              <TableCell className="max-w-[100px] truncate">{course._id}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{course.description}</TableCell>
              <TableCell>{course.subject}</TableCell>
              <TableCell>
                <Badge variant={course.isPublished ? "default" : "outline"} className={course.isPublished ? "bg-green-500" : ""}>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{`${course.createdById.first_name} ${course.createdById.last_name}`}</TableCell>
              <TableCell>{formatDate(new Date(course.createdAt))}</TableCell>
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
                      <Link href={`/dashboard/courses/${course._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Course
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => handleDeleteClick(course._id)}>
                        <Delete className="mr-2 h-4 w-4" />
                        Delete Course
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
          <TableCell colSpan={8}>Total</TableCell>
          <TableCell className="text-right">
            {coursesData.totalCourses}
          </TableCell>
        </TableRow>
      </TableFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to
              permanently delete this course from server?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={courseMutation.status === 'pending'}
              onClick={() =>
                courseMutation.mutate({
                  type: CourseMutationType.DELETE,
                  courseId: selectedCourseId,
                })
              }
            >
              {courseMutation.status === 'pending' ? (
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

export default DashboardCoursesList;
