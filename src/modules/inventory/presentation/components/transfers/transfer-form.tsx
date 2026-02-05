"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { FormField } from "@/ui/components/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/components/select";
import {
  createTransferSchema,
  toCreateTransferDto,
  type CreateTransferFormData,
} from "../../schemas/transfer.schema";
import { useCreateTransfer } from "../../hooks/use-transfers";
import { useProducts } from "../../hooks/use-products";
import { useWarehouses } from "../../hooks/use-warehouses";

interface TransferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferForm({ open, onOpenChange }: TransferFormProps) {
  const t = useTranslations("inventory.transfers");
  const tCommon = useTranslations("common");
  const createTransfer = useCreateTransfer();
  const { data: productsData } = useProducts({ limit: 100, isActive: true });
  const { data: warehousesData } = useWarehouses({ limit: 100, isActive: true });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateTransferFormData>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      productId: "",
      fromWarehouseId: "",
      toWarehouseId: "",
      quantity: 1,
      notes: "",
    },
  });

  const selectedFromWarehouse = watch("fromWarehouseId");

  // Filter out the source warehouse from destination options
  const toWarehouseOptions = warehousesData?.data.filter(
    (w) => w.id !== selectedFromWarehouse
  ) || [];

  const onSubmit = async (data: CreateTransferFormData) => {
    try {
      const dto = toCreateTransferDto(data);
      await createTransfer.mutateAsync(dto);
      onOpenChange(false);
      reset();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("form.createTitle")}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {createTransfer.isError && (
              <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {t("form.error")}
              </div>
            )}

            <FormField error={errors.productId?.message}>
              <Label>{t("fields.product")}</Label>
              <Controller
                name="productId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {productsData?.data.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormField error={errors.fromWarehouseId?.message}>
                  <Label>{t("fields.from")}</Label>
                  <Controller
                    name="fromWarehouseId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("fields.fromPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {warehousesData?.data.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              <ArrowRight className="mb-3 h-5 w-5 text-muted-foreground" />

              <div className="flex-1">
                <FormField error={errors.toWarehouseId?.message}>
                  <Label>{t("fields.to")}</Label>
                  <Controller
                    name="toWarehouseId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger disabled={!selectedFromWarehouse}>
                          <SelectValue placeholder={t("fields.toPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {toWarehouseOptions.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>
            </div>

            <FormField error={errors.quantity?.message}>
              <Label>{t("fields.quantity")}</Label>
              <Input
                type="number"
                min="1"
                placeholder={t("fields.quantityPlaceholder")}
                {...register("quantity", { valueAsNumber: true })}
              />
            </FormField>

            <FormField error={errors.notes?.message}>
              <Label>{t("fields.notes")}</Label>
              <Input
                placeholder={t("fields.notesPlaceholder")}
                {...register("notes")}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={createTransfer.isPending}>
                {createTransfer.isPending ? tCommon("loading") : tCommon("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
