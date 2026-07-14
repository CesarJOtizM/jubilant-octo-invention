"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";

export const TABLE_PAGINATION_ALL_VALUE = "all";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  /** When true (default), adds an "All" option that requests `total` items. */
  includeAllOption?: boolean;
  showingLabel: string;
  perPageLabel?: string;
  allLabel?: string;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (page > 3) {
    pages.push("...");
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (page < totalPages - 2) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function resolveSelectValue(limit: number, pageSizeOptions: number[]): string {
  return pageSizeOptions.includes(limit)
    ? String(limit)
    : TABLE_PAGINATION_ALL_VALUE;
}

export function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  includeAllOption = true,
  showingLabel,
  perPageLabel = "Per page",
  allLabel = "All",
}: TablePaginationProps) {
  if (total === 0) return null;

  const pageNumbers = getPageNumbers(page, totalPages);
  const selectValue = resolveSelectValue(limit, pageSizeOptions);

  const handlePageSizeChange = (value: string) => {
    if (value === TABLE_PAGINATION_ALL_VALUE) {
      onPageSizeChange(Math.max(total, 1));
      return;
    }
    onPageSizeChange(Number(value));
  };

  return (
    <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">{showingLabel}</p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {perPageLabel}
          </span>
          <Select value={selectValue} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[5.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
              {includeAllOption ? (
                <SelectItem value={TABLE_PAGINATION_ALL_VALUE}>
                  {allLabel}
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-2 text-sm text-muted-foreground sm:hidden">
              {page}/{totalPages}
            </span>

            <span className="hidden items-center gap-1 sm:flex">
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    key={`ellipsis-${i}`}
                    className="px-1 text-sm text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
