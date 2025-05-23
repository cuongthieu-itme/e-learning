import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination/pagination';
import { usePagination } from '@/hooks/core/usePagination.hook';
import { getTruncatedPageRange } from '@/lib/utils/pagination.utils';

type PaginationProps = {
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  currentPage: number;
};

const PaginateList: React.FC<PaginationProps> = ({
  totalItems,
  onPageChange,
  itemsPerPage,
  currentPage,
}) => {
  const { totalPages } = usePagination({
    totalItems,
    itemsPerPage,
  });

  const pageRange = getTruncatedPageRange(currentPage, totalPages, 10);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          ) : (
            <PaginationPrevious isActive={false} />
          )}
        </PaginationItem>

        {pageRange.map((pageOrEllipsis, index) => {
          if (pageOrEllipsis === '...') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else {
            const pageNumber = pageOrEllipsis as number;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          }
        })}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          ) : (
            <PaginationNext isActive={false} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginateList;
