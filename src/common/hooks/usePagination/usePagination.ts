import { useMemo } from 'react'

export const DOTS = 'DOTS'

const range = (start: number, end: number) => {
  const length = end - start + 1
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start)
}

interface Props {
  maxPages: number
  currentPage: number
  siblingCount?: number
  hideLastPage?: boolean
}

const usePagination = ({
  maxPages,
  siblingCount = 1,
  currentPage,
  hideLastPage = false
}: Props) => {
  const paginationRange = useMemo(() => {
    if (maxPages === 0) return [1]

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..maxPages]
    */
    if (totalPageNumbers >= maxPages) {
      return range(1, maxPages)
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and maxPages
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, maxPages)

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and maxPages. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < maxPages - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < maxPages - 2

    const firstPageIndex = 1
    const lastPageIndex = maxPages

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      if (hideLastPage) return leftRange

      return [...leftRange, `${DOTS}-end`, maxPages]
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(maxPages - rightItemCount + 1, maxPages)
      return [firstPageIndex, `${DOTS}-start`, ...rightRange]
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)

      if (hideLastPage) return [firstPageIndex, DOTS, ...middleRange]

      return [firstPageIndex, `${DOTS}-start`, ...middleRange, `${DOTS}-end`, lastPageIndex]
    }

    return [1]
  }, [siblingCount, maxPages, currentPage, hideLastPage])

  return paginationRange
}

export default usePagination
