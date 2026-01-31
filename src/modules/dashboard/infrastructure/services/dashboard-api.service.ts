import { env } from "@/config/env";
import { TokenService } from "@/modules/authentication/infrastructure/services/token.service";
import type {
  DashboardMetricsDto,
  InventoryAvailableResponseDto,
  LowStockResponseDto,
  SalesReportResponseDto,
} from "../../application/dto/metrics.dto";

export class DashboardApiService {
  private readonly baseUrl = env.NEXT_PUBLIC_API_URL;

  private getHeaders(): HeadersInit {
    const accessToken = TokenService.getAccessToken();
    const organizationSlug = TokenService.getOrganizationSlug();
    const organizationId = TokenService.getOrganizationId();
    const user = TokenService.getUser();

    return {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(organizationSlug && { "X-Organization-Slug": organizationSlug }),
      ...(organizationId && { "X-Organization-ID": organizationId }),
      ...(user?.id && { "X-User-ID": user.id }),
    };
  }

  private getMonthDateRange(): { startDate: string; endDate: string } {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: endOfMonth.toISOString().split("T")[0],
    };
  }

  async getMetrics(): Promise<DashboardMetricsDto> {
    const headers = this.getHeaders();
    const { startDate, endDate } = this.getMonthDateRange();

    const [inventoryResponse, lowStockResponse, salesResponse] =
      await Promise.all([
        fetch(`${this.baseUrl}/reports/inventory/available/view`, {
          method: "GET",
          headers,
        }),
        fetch(`${this.baseUrl}/reports/inventory/low-stock/view`, {
          method: "GET",
          headers,
        }),
        fetch(
          `${this.baseUrl}/reports/sales/view?dateRange[startDate]=${startDate}&dateRange[endDate]=${endDate}`,
          {
            method: "GET",
            headers,
          }
        ),
      ]);

    // Handle API errors
    if (!inventoryResponse.ok || !lowStockResponse.ok || !salesResponse.ok) {
      const failedResponses = [
        !inventoryResponse.ok && "inventory",
        !lowStockResponse.ok && "low-stock",
        !salesResponse.ok && "sales",
      ].filter(Boolean);

      throw new Error(`Failed to fetch dashboard metrics: ${failedResponses.join(", ")}`);
    }

    const [inventoryData, lowStockData, salesData]: [
      InventoryAvailableResponseDto,
      LowStockResponseDto,
      SalesReportResponseDto
    ] = await Promise.all([
      inventoryResponse.json(),
      lowStockResponse.json(),
      salesResponse.json(),
    ]);

    return {
      inventory: {
        totalProducts: inventoryData.data.summary.totalItems,
        totalValue: inventoryData.data.summary.totalValue,
        totalQuantity: inventoryData.data.summary.totalQuantity,
      },
      lowStock: {
        criticalCount: lowStockData.data.total,
      },
      sales: {
        monthlyTotal: salesData.data.summary.totalSales,
        monthlyRevenue: salesData.data.summary.totalRevenue,
      },
    };
  }
}

export const dashboardApiService = new DashboardApiService();
