import { Delete, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';

import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
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
import { CourseTopicMutationType, useCourseTopicMutation } from '@/hooks/mutations/useCourseTopic.mutation';
import { ICourseTopic } from '@/types/course-topic.types';

type DashboardCourseTopicsListProps = {
  courseTopicsData: { courseTopics: ICourseTopic[]; totalCourseTopics: number };
};

const DashboardCourseTopicsList: React.FC<DashboardCourseTopicsListProps> = ({
  courseTopicsData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const courseTopicMutation = useCourseTopicMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['course-topics'] });

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

  return (
    <Table>
      <TableCaption>A list of your course topics</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            'Id',
            'Topic',
            'Actions',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {courseTopicsData.courseTopics.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>No course topics found</TableCell>
          </TableRow>
        ) : (
          courseTopicsData.courseTopics.map((courseTopic) => (
            <TableRow className="whitespace-nowrap" key={courseTopic._id}>
              <TableCell>{courseTopic._id}</TableCell>
              <TableCell>{courseTopic.topic}</TableCell>
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
                      <Link href={`/dashboard/course-topics/${courseTopic._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit />
                          Edit Course Topic
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                        <Delete />
                        Delete Course Topic
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Course Topic</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this course topic from server?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={courseTopicMutation.status === 'pending'}
                        onClick={() =>
                          courseTopicMutation.mutate({
                            type: CourseTopicMutationType.DELETE,
                            courseTopicId: courseTopic._id,
                          })
                        }
                      >
                        {courseTopicMutation.status === 'pending' ? (
                          <Loader type="ScaleLoader" height={20} />
                        ) : (
                          'Confirm'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell className="text-right">
            {courseTopicsData.totalCourseTopics}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DashboardCourseTopicsList;
