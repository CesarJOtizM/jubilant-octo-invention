import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { TokenService } from "@/modules/authentication/infrastructure/services/token.service";
import type {
  HttpClientPort,
  HttpClientConfig,
  HttpRequestConfig,
  HttpResponse,
} from "@/shared/application/ports/http-client.port";

/**
 * Axios HTTP Client Adapter
 * Implements HttpClientPort with axios, including auth interceptors
 */
export class AxiosHttpClient implements HttpClientPort {
  private readonly instance: AxiosInstance;

  constructor(config?: HttpClientConfig) {
    this.instance = axios.create({
      baseURL: config?.baseURL ?? env.NEXT_PUBLIC_API_URL,
      timeout: config?.timeout ?? env.NEXT_PUBLIC_API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth headers
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = TokenService.getAccessToken();
        const organizationSlug = TokenService.getOrganizationSlug();
        const organizationId = TokenService.getOrganizationId();
        const user = TokenService.getUser();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (organizationSlug) {
          config.headers["X-Organization-Slug"] = organizationSlug;
        }

        if (organizationId) {
          config.headers["X-Organization-ID"] = organizationId;
        }

        if (user?.id) {
          config.headers["X-User-ID"] = user.id;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = TokenService.getRefreshToken();
          if (refreshToken && !TokenService.isTokenExpired()) {
            try {
              // Token refresh logic would go here
              // For now, just clear tokens and let the app redirect to login
              TokenService.clearTokens();
            } catch {
              TokenService.clearTokens();
            }
          } else {
            TokenService.clearTokens();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private toHttpResponse<T>(response: {
    data: T;
    status: number;
    headers: Record<string, unknown>;
  }): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    return this.toHttpResponse(response);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);
    return this.toHttpResponse(response);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.put<T>(url, data, config);
    return this.toHttpResponse(response);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.patch<T>(url, data, config);
    return this.toHttpResponse(response);
  }

  async delete<T>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.delete<T>(url, config);
    return this.toHttpResponse(response);
  }
}

// Singleton instance for easy use
export const apiClient = new AxiosHttpClient();
