"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
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

export function MovementFormPage() {
  const t = useTranslations("inventory.movements");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const createMovement = useCreateMovement();
  const { data: productsData } = useProducts({ limit: 100, isActive: true });
  const { data: warehousesData } = useWarehouses({ limit: 100, isActive: true });

  const isSubmitting = createMovement.isPending;

  const {
    register,
    handleSubmit,
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
      router.push("/dashboard/inventory/movements");
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/inventory/movements">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("form.createTitle")}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {t("form.createDescription")}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.movementInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {createMovement.isError && (
              <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {t("form.error")}
              </div>
            )}

            {/* Movement Type */}
            <FormField error={errors.type?.message}>
              <Label>{t("fields.type")} *</Label>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Product Selection */}
              <FormField error={errors.productId?.message}>
                <Label>{t("fields.product")} *</Label>
                <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("fields.productPlaceholder")} />
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

              {/* Warehouse Selection */}
              <FormField error={errors.warehouseId?.message}>
                <Label>{t("fields.warehouse")} *</Label>
                <Controller
                  name="warehouseId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("fields.warehousePlaceholder")} />
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

            {/* Quantity */}
            <FormField error={errors.quantity?.message}>
              <Label>{t("fields.quantity")} *</Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                {...register("quantity", { valueAsNumber: true })}
              />
            </FormField>

            {/* Reason */}
            <FormField error={errors.reason?.message}>
              <Label>{t("fields.reason")} *</Label>
              <Input
                placeholder={t("fields.reasonPlaceholder")}
                {...register("reason")}
              />
            </FormField>

            {/* Reference */}
            <FormField error={errors.reference?.message}>
              <Label>{t("fields.reference")}</Label>
              <Input
                placeholder={t("fields.referencePlaceholder")}
                {...register("reference")}
              />
            </FormField>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <Button asChild type="button" variant="outline">
                <Link href="/dashboard/inventory/movements">
                  {tCommon("cancel")}
                </Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? tCommon("loading") : tCommon("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
