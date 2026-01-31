"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { FormField } from "@/ui/components/form-field";
import { loginSchema, type LoginDto } from "../../application/dto/login.dto";
import { useRouter } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true);
    try {
      // TODO: Implement login logic with use case
      console.log("Login data:", data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField error={errors.email?.message}>
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          {...register("email")}
        />
      </FormField>

      <FormField error={errors.password?.message}>
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          {...register("password")}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
