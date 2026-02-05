"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { FormField } from "@/ui/components/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/components/select";
import {
  createMovementSchema,
  toCreateMovementDto,
  type CreateMovementFormData,
} from "../../schemas/movement.schema";
import { useCreateMovement } from "../../hooks/use-movements";
import { useProducts } from "../../hooks/use-products";
import { useWarehouses } from "../../hooks/use-warehouses";

interface MovementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovementForm({ open, onOpenChange }: MovementFormProps) {
  const t = useTranslations("inventory.movements");
  const tCommon = useTranslations("common");
  const createMovement = useCreateMovement();
  const { data: productsData } = useProducts({ limit: 100, isActive: true });
  const { data: warehousesData } = useWarehouses({ limit: 100, isActive: true });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateMovementFormData>({
    resolver: zodResolver(createMovementSchema),
    defaultValues: {
      productId: "",
      warehouseId: "",
      type: "IN",
      quantity: 1,
      reason: "",
      reference: "",
    },
  });

  const onSubmit = async (data: CreateMovementFormData) => {
    try {
      const dto = toCreateMovementDto(data);
      await createMovement.mutateAsync(dto);
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
            {createMovement.isError && (
              <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {t("form.error")}
              </div>
            )}

            <FormField error={errors.type?.message}>
              <Label>{t("fields.type")}</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">{t("types.in")}</SelectItem>
                      <SelectItem value="OUT">{t("types.out")}</SelectItem>
                      <SelectItem value="ADJUSTMENT">{t("types.adjustment")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

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

            <FormField error={errors.warehouseId?.message}>
              <Label>{t("fields.warehouse")}</Label>
              <Controller
                name="warehouseId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a warehouse" />
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

            <FormField error={errors.quantity?.message}>
              <Label>{t("fields.quantity")}</Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                {...register("quantity", { valueAsNumber: true })}
              />
            </FormField>

            <FormField error={errors.reason?.message}>
              <Label>{t("fields.reason")}</Label>
              <Input
                placeholder={t("fields.reasonPlaceholder")}
                {...register("reason")}
              />
            </FormField>

            <FormField error={errors.reference?.message}>
              <Label>{t("fields.reference")}</Label>
              <Input
                placeholder={t("fields.referencePlaceholder")}
                {...register("reference")}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={createMovement.isPending}>
                {createMovement.isPending ? tCommon("loading") : tCommon("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
