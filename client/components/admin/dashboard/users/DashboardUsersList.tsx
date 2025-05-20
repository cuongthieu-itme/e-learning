import { Button } from '@/components/ui/buttons/button';
import { Badge } from '@/components/ui/info/badge';
import Loader from '@/components/ui/info/loader';
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
import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import {
  UserMutationType,
  useUserMutation,
} from '@/hooks/mutations/useUser.mutation';
import { formatDate } from '@/lib/utils';
import { IUser, Role } from '@/types';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

type DashboardUsersListProps = {
  usersData: { users: IUser[]; totalUsers: number };
};

const getRoleBadgeVariant = (role: Role) => {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'teacher':
      return 'default';
    case 'user':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getRoleLabel = (role: Role) => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'teacher':
      return 'Giảng viên';
    case 'user':
      return 'Học viên';
    default:
      return role;
  }
};

const DashboardUsersList: React.FC<DashboardUsersListProps> = ({
  usersData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { toast } = useToast();

  const userMutation = useUserMutation({
    onSuccess: (response: ServerResponse) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

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

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  return (
    <Table>
      <TableCaption>Danh sách tất cả người dùng</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            '#',
            'Họ',
            'Tên',
            'Email',
            'Vai trò',
            'Tài khoản Google',
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
        {usersData.users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9}>Không tìm thấy người dùng</TableCell>
          </TableRow>
        ) : (
          usersData.users.map((user, index) => (
            <TableRow className="whitespace-nowrap" key={user._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isGoogleAccount ? 'secondary' : 'outline'}>
                  {user.isGoogleAccount ? 'Có' : 'Không'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(new Date(user.createdAt))}</TableCell>
              <TableCell>
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
                      <Link href={`/dashboard/users/${user._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa người dùng
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => handleDeleteClick(user._id)}>
                        <Delete className="mr-2 h-4 w-4" />
                        Xóa người dùng
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
          <TableCell colSpan={8}>Tổng</TableCell>
          <TableCell className="text-right">{usersData.totalUsers}</TableCell>
        </TableRow>
      </TableFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa người dùng</DialogTitle>
            <DialogDescription>
              Điều này không thể hoàn tác. Bạn có chắc chắn muốn xóa người dùng này khỏi máy chủ không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={userMutation.status === 'pending'}
              onClick={() =>
                userMutation.mutate({
                  type: UserMutationType.DELETE,
                  userId: selectedUserId,
                })
              }
            >
              {userMutation.status === 'pending' ? (
                <Loader type="ScaleLoader" height={20} />
              ) : (
                'Xác nhận'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Table>
  );
};

export default DashboardUsersList;
