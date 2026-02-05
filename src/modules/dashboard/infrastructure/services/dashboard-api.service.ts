import { apiClient } from "@/shared/infrastructure/http";
import type {
  DashboardMetricsDto,
  InventoryAvailableResponseDto,
  LowStockResponseDto,
  SalesReportResponseDto,
} from "../../application/dto/metrics.dto";

/**
 * Dashboard API Service
 * Uses centralized axios HTTP client with interceptors for auth
 */
export class DashboardApiService {
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
    const { startDate, endDate } = this.getMonthDateRange();

    const [inventoryResponse, lowStockResponse, salesResponse] =
      await Promise.all([
        apiClient.get<InventoryAvailableResponseDto>(
          "/reports/inventory/available/view"
        ),
        apiClient.get<LowStockResponseDto>("/reports/inventory/low-stock/view"),
        apiClient.get<SalesReportResponseDto>("/reports/sales/view", {
          params: {
            "dateRange[startDate]": startDate,
            "dateRange[endDate]": endDate,
          },
        }),
      ]);

    const inventoryData = inventoryResponse.data;
    const lowStockData = lowStockResponse.data;
    const salesData = salesResponse.data;

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
