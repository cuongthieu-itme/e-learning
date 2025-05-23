'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useToast } from '@/hooks/core/use-toast';
import { UserMutationType, useUserMutation } from '@/hooks/mutations/useUser.mutation';
import { IUser } from '@/types';
import { queryClient } from '@/context/react-query-client';

import { Button } from '@/components/ui/buttons/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';
import { Separator } from '@/components/ui/layout/separator';
import Loader from '@/components/ui/info/loader';

const CreateUserSchema = z.object({
  first_name: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
  last_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  role: z.enum(['user', 'admin', 'teacher']),
});

const UpdateUserSchema = CreateUserSchema.partial();

type HandleUserProps = {
  isEdit?: boolean;
  user?: IUser;
};

const HandleUser: React.FC<HandleUserProps> = ({ isEdit = false, user }) => {
  const { toast } = useToast();
  const router = useRouter();
  
  const schema = isEdit ? UpdateUserSchema : CreateUserSchema;

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      role: (user?.role as 'user' | 'admin' | 'teacher') || 'user',
    },
  });

  const userMutation = useUserMutation({
    onSuccess: (response: ServerResponse) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      form.reset();
      
      toast({
        title: 'Thành công 🚀',
        description: response.message,
      });
      
      setTimeout(() => {
        router.push('/dashboard/users');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });
  
  const isLoading = userMutation.status === 'pending';

  const handleFormSubmit = async (data: z.infer<typeof CreateUserSchema>) => {
    if (isEdit && user) {
      userMutation.mutate({
        type: UserMutationType.UPDATE,
        userId: user._id,
        data,
      });
    } else {
      userMutation.mutate({
        type: UserMutationType.CREATE,
        data,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">        
        <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò *</FormLabel>
              <FormDescription>
                Chọn vai trò của người dùng trong hệ thống
              </FormDescription>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Học viên</SelectItem>
                  <SelectItem value="teacher">Giảng viên</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!form.formState.isValid || isLoading}
        >
          {form.formState.isSubmitting || isLoading ? (
            <Loader type="ScaleLoader" height={20} color="#ffffff" />
          ) : (
            isEdit ? 'Cập nhật người dùng' : 'Tạo người dùng'
          )}
        </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleUser;
