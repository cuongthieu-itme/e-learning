import { Edit, User } from 'lucide-react';
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
import { Role } from '@/types/shared.types';
import { IUser } from '@/types/user.types';

type UserDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
};

const getRoleBadge = (role: Role) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-purple-500">Quản trị viên</Badge>;
    case 'teacher':
      return <Badge className="bg-blue-500">Giáo viên</Badge>;
    case 'user':
      return <Badge className="bg-green-500">Học sinh</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onOpenChange,
  user,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden h-[calc(100vh-10rem)]">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center text-xl">
            <User className="text-primary mr-2 h-5 w-5" />
            Chi tiết người dùng
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 overflow-y-auto max-h-[80vh]">
          {/* Profile Section */}
          <div className="bg-slate-50 rounded-lg p-5 my-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-slate-700 flex items-center">
                <span className="inline-flex justify-center items-center w-7 h-7 rounded-full bg-primary text-white font-semibold mr-2">P</span>
                Thông tin cá nhân
              </h3>
              {getRoleBadge(user.role)}
            </div>

            <div className="pl-9 space-y-3">
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-500">Họ tên:</div>
                <div className="text-base font-medium">{user.first_name} {user.last_name}</div>
              </div>
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-500">Email:</div>
                <div className="text-base">{user.email}</div>
              </div>
              <div className="flex items-center">
                <div className="w-32 text-sm text-slate-500">Loại tài khoản:</div>
                <div className="text-base">
                  {user.isGoogleAccount ? (
                    <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">Google</Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-500 text-slate-600 bg-slate-50">Thông thường</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="my-6">
              <h3 className="text-base font-medium text-slate-700 mb-4 flex items-center">
                <span className="inline-block w-1 h-5 bg-green-500 rounded-full mr-2"></span>
                Địa chỉ
              </h3>

              <div className="space-y-3">
                {user.addresses.map((address, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                    <p className="text-sm mb-1 font-medium">Địa chỉ {index + 1}</p>
                    <p className="text-sm text-slate-700">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      {`, ${address.city}, ${address.state} ${address.postalCode}`}
                      {`, ${address.country}`}
                      {address.isDefault && " (Mặc định)"}
                    </p>
                  </div>
                ))}
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
              {/* Creation Date */}
              {user.createdAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Ngày tạo</h4>
                  <p className="text-sm">{new Date(user.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              {/* Last Update */}
              {user.updatedAt && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cập nhật cuối</h4>
                  <p className="text-sm">{new Date(user.updatedAt).toLocaleDateString('vi-VN', {
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
          <Link href={`/dashboard/users/${user?._id}/edit`}>
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

export default UserDetailModal;
