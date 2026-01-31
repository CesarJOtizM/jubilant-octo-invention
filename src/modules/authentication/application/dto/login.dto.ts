import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface LoginResponseDto {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    roles: string[];
    permissions: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
