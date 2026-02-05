"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, ArrowRightLeft } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import { Skeleton } from "@/ui/components/skeleton";
import { useMovements } from "../../hooks/use-movements";
import { MovementTypeBadge } from "./movement-type-badge";
import { MovementFilters } from "./movement-filters";
import { MovementForm } from "./movement-form";
import type { StockMovementFilters } from "../../../application/dto/stock-movement.dto";

export function MovementList() {
  const t = useTranslations("inventory.movements");
  const [filters, setFilters] = useState<StockMovementFilters>({
    page: 1,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading, isError } = useMovements(filters);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-destructive">{t("error.loading")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{t("list.title")}</CardTitle>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("actions.new")}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <MovementFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data?.data.length ? (
            <div className="py-10 text-center">
              <ArrowRightLeft className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t("empty.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("empty.description")}
              </p>
              <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.new")}
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-3 pr-4">{t("fields.type")}</th>
                      <th className="pb-3 pr-4">{t("fields.product")}</th>
                      <th className="pb-3 pr-4">{t("fields.warehouse")}</th>
                      <th className="pb-3 pr-4">{t("fields.quantity")}</th>
                      <th className="pb-3 pr-4">{t("fields.previousQty")} → {t("fields.newQty")}</th>
                      <th className="pb-3 pr-4">{t("fields.reason")}</th>
                      <th className="pb-3 pr-4">{t("fields.createdAt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((movement) => (
                      <tr key={movement.id} className="border-b">
                        <td className="py-4 pr-4">
                          <MovementTypeBadge type={movement.type} />
                        </td>
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-medium">{movement.productName}</p>
                            <p className="text-sm text-muted-foreground">{movement.productSku}</p>
                          </div>
                        </td>
                        <td className="py-4 pr-4">{movement.warehouseName}</td>
                        <td className="py-4 pr-4">
                          <span className={
                            movement.type === "IN"
                              ? "text-green-600 dark:text-green-400"
                              : movement.type === "OUT"
                                ? "text-red-600 dark:text-red-400"
                                : "text-yellow-600 dark:text-yellow-400"
                          }>
                            {movement.type === "IN" ? "+" : movement.type === "OUT" ? "-" : "±"}
                            {movement.quantity}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="text-muted-foreground">{movement.previousQuantity}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{movement.newQuantity}</span>
                        </td>
                        <td className="py-4 pr-4">
                          <p className="max-w-xs truncate">{movement.reason}</p>
                          {movement.reference && (
                            <p className="text-sm text-muted-foreground">
                              Ref: {movement.reference}
                            </p>
                          )}
                        </td>
                        <td className="py-4 pr-4 text-sm text-muted-foreground">
                          {formatDate(movement.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("pagination.showing", {
                      from: (data.pagination.page - 1) * data.pagination.limit + 1,
                      to: Math.min(
                        data.pagination.page * data.pagination.limit,
                        data.pagination.total
                      ),
                      total: data.pagination.total,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.pagination.page <= 1}
                      onClick={() => setFilters((prev) => ({ ...prev, page: data.pagination.page - 1 }))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.pagination.page >= data.pagination.totalPages}
                      onClick={() => setFilters((prev) => ({ ...prev, page: data.pagination.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <MovementForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
}
