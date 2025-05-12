import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingCart: React.FC = () => {
  return (
    <div className="grid grid-cols-[2.5fr,1fr] gap-5 pt-5 max-xl:grid-cols-1">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  );
};

export default LoadingCart;
