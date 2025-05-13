import Link from 'next/link';

const RedirectToLoginLink: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-muted-foreground">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-blue-600 underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default RedirectToLoginLink;
