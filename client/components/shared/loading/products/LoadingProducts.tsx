import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingProducts: React.FC = () => {
  return (
    <div className="grid grid-cols-[1fr_3fr] gap-10 pt-5 max-lg:grid-cols-1">
      <div>
        <Skeleton className="min-h-full" />
      </div>
      <div className="space-y-5">
        <Skeleton className="h-10 w-28" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 20 }, (_, index) => index).map((index) => (
            <Skeleton key={index} className="h-96" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingProducts;
