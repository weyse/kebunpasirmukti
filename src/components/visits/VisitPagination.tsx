
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface VisitPaginationProps {
  filteredVisits: any[];
  totalVisits: number;
  currentPage?: number;
  totalPages?: number;
  nextPage?: () => void;
  prevPage?: () => void;
  paginate?: (page: number) => void;
}

export const VisitPagination: React.FC<VisitPaginationProps> = ({
  filteredVisits,
  totalVisits,
  currentPage = 1,
  totalPages = 1,
  nextPage,
  prevPage,
  paginate,
}) => {
  // Simple pagination for now
  const isPrevDisabled = !prevPage || currentPage <= 1;
  const isNextDisabled = !nextPage || currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t gap-4">
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredVisits.length} dari {totalVisits} kunjungan
      </div>
      
      {totalPages > 1 && paginate ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={prevPage} 
                className={isPrevDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={page === currentPage} 
                  onClick={() => paginate(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={nextPage} 
                className={isNextDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <div className="flex gap-2">
          <PaginationPrevious className="opacity-50 pointer-events-none" />
          <PaginationNext className="opacity-50 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
