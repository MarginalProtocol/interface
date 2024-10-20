import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { DOTS, usePagination } from "src/hooks/usePagination"

interface PaginationProps {
  totalCount: number
  pageSize: number
  siblingCount?: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null
  }

  const nextPage = () => {
    onPageChange(currentPage + 1)
  }

  const prevPage = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange?.[paginationRange.length - 1]

  return (
    <div className="mt-2 flex space-x-2 justify-center items-center text-white">
      <ChevronLeftIcon
        onClick={currentPage === 1 ? () => {} : prevPage}
        className={`w-6 h-6 ${currentPage === 1 ? "opacity-80" : "hover:opacity-80 hover:text-marginalOrange-500 cursor-pointer"}`}
      />
      {paginationRange?.map((pageNumber) => {
        if (pageNumber.toString() === DOTS) {
          return <div className="">&#8230;</div>
        }

        return (
          <button
            disabled={currentPage === pageNumber}
            className={`${currentPage === pageNumber ? "disabled:text-marginalOrange-500  disabled:cursor-auto" : "hover:opacity-80 hover:text-marginalOrange-500 cursor-pointer"}`}
            onClick={() => onPageChange(Number(pageNumber))}
          >
            {pageNumber}
          </button>
        )
      })}

      <ChevronRightIcon
        onClick={currentPage === lastPage ? () => {} : nextPage}
        className={`w-6 h-6 ${currentPage === lastPage ? "opacity-80" : "hover:opacity-80 hover:text-marginalOrange-500 cursor-pointer"}`}
      />
    </div>
  )
}

export default Pagination
