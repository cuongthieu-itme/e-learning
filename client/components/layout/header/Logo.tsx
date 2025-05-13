import Link from 'next/link';

const Logo: React.FC<{ href?: string }> = ({ href = '/' }) => {
  return (
    <Link className="w-fit" href={href}>
      <h1 className="text-2xl font-bold">E-Learning</h1>
    </Link>
  );
};

export default Logo;
