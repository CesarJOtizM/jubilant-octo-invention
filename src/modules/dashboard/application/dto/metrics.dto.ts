/**
 * API Response DTOs for dashboard metrics
 */

export interface InventoryAvailableResponseDto {
  data: {
    summary: {
      totalItems: number;
      totalValue: number;
      totalQuantity: number;
    };
    items: Array<{
      productId: string;
      productName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
      totalValue: number;
    }>;
  };
}

export interface LowStockResponseDto {
  data: {
    items: Array<{
      productId: string;
      productName: string;
      sku: string;
      currentQuantity: number;
      minQuantity: number;
      warehouseId: string;
      warehouseName: string;
    }>;
    total: number;
  };
}

export interface SalesReportResponseDto {
  data: {
    summary: {
      totalSales: number;
      totalRevenue: number;
      averageOrderValue: number;
    };
    items: Array<{
      date: string;
      salesCount: number;
      revenue: number;
    }>;
  };
}

/**
 * Internal DTO for dashboard metrics
 */
export interface DashboardMetricsDto {
  inventory: {
    totalProducts: number;
    totalValue: number;
    totalQuantity: number;
  };
  lowStock: {
    criticalCount: number;
  };
  sales: {
    monthlyTotal: number;
    monthlyRevenue: number;
  };
}
