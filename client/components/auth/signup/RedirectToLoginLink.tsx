import Link from 'next/link';

const RedirectToLoginLink: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-muted-foreground">
        Already have account?{' '}
        <Link href="/login" className="text-blue-600 underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RedirectToLoginLink;
