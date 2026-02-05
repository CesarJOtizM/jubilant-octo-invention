"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  createProductSchema,
  toCreateProductDto,
  toUpdateProductDto,
  type CreateProductFormData,
} from "../../schemas/product.schema";
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
} from "../../hooks/use-products";

interface ProductFormPageProps {
  productId?: string;
}

export function ProductFormPage({ productId }: ProductFormPageProps) {
  const t = useTranslations("inventory.products");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const isEditing = Boolean(productId);

  const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(
    productId || ""
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      unitOfMeasure: "unit",
      cost: 0,
      price: 0,
      minStock: 0,
      maxStock: 100,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && existingProduct) {
      reset({
        sku: existingProduct.sku,
        name: existingProduct.name,
        description: existingProduct.description || "",
        categoryId: existingProduct.categoryId || "",
        unitOfMeasure: existingProduct.unitOfMeasure,
        cost: existingProduct.cost,
        price: existingProduct.price,
        minStock: existingProduct.minStock,
        maxStock: existingProduct.maxStock,
        imageUrl: existingProduct.imageUrl || "",
      });
    }
  }, [isEditing, existingProduct, reset]);

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      if (isEditing && productId) {
        const dto = toUpdateProductDto(data);
        await updateProduct.mutateAsync({ id: productId, data: dto });
        router.push(`/dashboard/inventory/products/${productId}`);
      } else {
        const dto = toCreateProductDto(data);
        const newProduct = await createProduct.mutateAsync(dto);
        router.push(`/dashboard/inventory/products/${newProduct.id}`);
      }
    } catch {
      // Error is handled by the mutation
    }
  };

  if (isLoadingProduct && isEditing) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/inventory/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {isEditing ? t("form.editTitle") : t("form.createTitle")}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {isEditing ? t("form.editDescription") : t("form.createDescription")}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.productInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {(createProduct.isError || updateProduct.isError) && (
              <div className="rounded-md bg-error-100 p-3 text-sm text-error-700">
                {t("form.error")}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField error={errors.sku?.message}>
                <Label htmlFor="sku">{t("fields.sku")} *</Label>
                <Input
                  id="sku"
                  placeholder={t("fields.skuPlaceholder")}
                  {...register("sku")}
                />
              </FormField>

              <FormField error={errors.name?.message}>
                <Label htmlFor="name">{t("fields.name")} *</Label>
                <Input
                  id="name"
                  placeholder={t("fields.namePlaceholder")}
                  {...register("name")}
                />
              </FormField>
            </div>

            <FormField error={errors.description?.message}>
              <Label htmlFor="description">{t("fields.description")}</Label>
              <Input
                id="description"
                placeholder={t("fields.descriptionPlaceholder")}
                {...register("description")}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField error={errors.unitOfMeasure?.message}>
                <Label htmlFor="unitOfMeasure">{t("fields.unitOfMeasure")} *</Label>
                <Input
                  id="unitOfMeasure"
                  placeholder={t("fields.unitOfMeasurePlaceholder")}
                  {...register("unitOfMeasure")}
                />
              </FormField>

              <FormField error={errors.categoryId?.message}>
                <Label htmlFor="categoryId">{t("fields.category")}</Label>
                <Input
                  id="categoryId"
                  placeholder={t("fields.categoryPlaceholder")}
                  {...register("categoryId")}
                />
              </FormField>
            </div>

            {/* Pricing */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-medium text-neutral-900 dark:text-neutral-100">
                {t("form.pricing")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField error={errors.cost?.message}>
                  <Label htmlFor="cost">{t("fields.cost")} *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("cost", { valueAsNumber: true })}
                  />
                </FormField>

                <FormField error={errors.price?.message}>
                  <Label htmlFor="price">{t("fields.price")} *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("price", { valueAsNumber: true })}
                  />
                </FormField>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-medium text-neutral-900 dark:text-neutral-100">
                {t("form.stockLevels")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField error={errors.minStock?.message}>
                  <Label htmlFor="minStock">{t("fields.minStock")} *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("minStock", { valueAsNumber: true })}
                  />
                </FormField>

                <FormField error={errors.maxStock?.message}>
                  <Label htmlFor="maxStock">{t("fields.maxStock")} *</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    min="0"
                    placeholder="100"
                    {...register("maxStock", { valueAsNumber: true })}
                  />
                </FormField>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <Button asChild type="button" variant="outline">
                <Link href="/dashboard/inventory/products">
                  {tCommon("cancel")}
                </Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? tCommon("loading")
                  : isEditing
                    ? tCommon("save")
                    : tCommon("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
