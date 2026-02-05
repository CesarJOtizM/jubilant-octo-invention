"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, ArrowRightLeft, MoreHorizontal, Play, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import { Skeleton } from "@/ui/components/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/components/select";
import { useTransfers, useUpdateTransferStatus } from "../../hooks/use-transfers";
import { TransferStatusBadge } from "./transfer-status-badge";
import { TransferForm } from "./transfer-form";
import type { TransferFilters } from "../../../application/dto/transfer.dto";
import type { TransferStatus } from "../../../domain/entities/transfer.entity";

export function TransferList() {
  const t = useTranslations("inventory.transfers");
  const [filters, setFilters] = useState<TransferFilters>({
    page: 1,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { data, isLoading, isError } = useTransfers(filters);
  const updateStatus = useUpdateTransferStatus();

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : (status as TransferStatus),
      page: 1,
    }));
  };

  const handleUpdateStatus = async (id: string, status: TransferStatus) => {
    await updateStatus.mutateAsync({ id, status });
    setOpenMenuId(null);
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
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">{t("status.pending")}</SelectItem>
                <SelectItem value="IN_TRANSIT">{t("status.in_transit")}</SelectItem>
                <SelectItem value="COMPLETED">{t("status.completed")}</SelectItem>
                <SelectItem value="CANCELLED">{t("status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
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
                      <th className="pb-3 pr-4">{t("fields.status")}</th>
                      <th className="pb-3 pr-4">{t("fields.product")}</th>
                      <th className="pb-3 pr-4">{t("fields.from")}</th>
                      <th className="pb-3 pr-4">{t("fields.to")}</th>
                      <th className="pb-3 pr-4">{t("fields.quantity")}</th>
                      <th className="pb-3 pr-4">{t("fields.createdAt")}</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((transfer) => (
                      <tr key={transfer.id} className="border-b">
                        <td className="py-4 pr-4">
                          <TransferStatusBadge status={transfer.status} />
                        </td>
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-medium">{transfer.productName}</p>
                            <p className="text-sm text-muted-foreground">{transfer.productSku}</p>
                          </div>
                        </td>
                        <td className="py-4 pr-4">{transfer.fromWarehouseName}</td>
                        <td className="py-4 pr-4">{transfer.toWarehouseName}</td>
                        <td className="py-4 pr-4 font-medium">{transfer.quantity}</td>
                        <td className="py-4 pr-4 text-sm text-muted-foreground">
                          {formatDate(transfer.createdAt)}
                        </td>
                        <td className="py-4 text-right">
                          {(transfer.isPending || transfer.isInTransit) && (
                            <div className="relative inline-block">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpenMenuId(openMenuId === transfer.id ? null : transfer.id)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              {openMenuId === transfer.id && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
                                  {transfer.canStartTransit && (
                                    <button
                                      className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                                      onClick={() => handleUpdateStatus(transfer.id, "IN_TRANSIT")}
                                      disabled={updateStatus.isPending}
                                    >
                                      <Play className="mr-2 h-4 w-4" />
                                      {t("actions.startTransit")}
                                    </button>
                                  )}
                                  {transfer.canComplete && (
                                    <button
                                      className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-green-600 hover:bg-accent"
                                      onClick={() => handleUpdateStatus(transfer.id, "COMPLETED")}
                                      disabled={updateStatus.isPending}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      {t("actions.complete")}
                                    </button>
                                  )}
                                  {transfer.canCancel && (
                                    <button
                                      className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
                                      onClick={() => handleUpdateStatus(transfer.id, "CANCELLED")}
                                      disabled={updateStatus.isPending}
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      {t("actions.cancel")}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
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

      <TransferForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
}
