import { useMemo } from "react";

type UsePaginationProps = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  siblingCount?: number;
};

export const usePagination = ({
  totalItems,
  pageSize,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
    // Tính tổng số trang
    const totalPageCount = Math.ceil(totalItems / pageSize);

    // Pages count được xác định là siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Trường hợp 1:
      Nếu số trang ít hơn hoặc bằng tổng số trang muốn hiển thị
      thì trả về phạm vi từ 1 đến totalPageCount
    */
    if (totalPageNumbers >= totalPageCount) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    // Tính chỉ số trang bên trái và phải của currentPage
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // Không hiển thị DOTS khi chỉ có 1 trang nằm giữa
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Trường hợp 2: Chỉ hiển thị dots bên phải
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, "DOTS", totalPageCount];
    }

    // Trường hợp 3: Chỉ hiển thị dots bên trái
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPageCount - rightItemCount + i + 1
      );

      return [firstPageIndex, "DOTS", ...rightRange];
    }

    // Trường hợp 4: Hiển thị dots cả bên trái và phải
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );

      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }

    return [];
  }, [totalItems, pageSize, currentPage, siblingCount]);

  return {
    paginationRange,
    totalPages: Math.ceil(totalItems / pageSize),
    hasNextPage: currentPage < Math.ceil(totalItems / pageSize),
    hasPreviousPage: currentPage > 1,
  };
};
