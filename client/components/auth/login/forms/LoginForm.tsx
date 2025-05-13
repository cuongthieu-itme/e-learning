import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/core/use-toast';
import { signin } from '@/lib/actions/auth.actions';
import { LoginSchema } from '@/lib/zod/auth.zod';

import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';

const LoginForm: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { mutateAsync: loginToAccount } = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      if (response.redirectUrl) {
        router.push(response.redirectUrl);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    await loginToAccount(data);
  };

  const handleGoogleSignIn = () => {
    if (form.formState.isSubmitting) return;

    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3 text-center">
          <Button
            variant="default"
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <Loader type="ScaleLoader" height={10} />
            ) : (
              'Đăng nhập'
            )}
          </Button>
          <p className="text-muted-foreground">Hoặc</p>
          <Button
            variant="outline"
            className="flex w-full items-center justify-center"
            disabled={form.formState.isSubmitting}
            type="button"
            onClick={() => handleGoogleSignIn()}
          >
            <Image
              src="/icons/google-icon-logo-transparent.png"
              alt="google-logo"
              width={40}
              height={40}
            />
            Đăng nhập với Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
