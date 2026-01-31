"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApiService } from "../../infrastructure/services/dashboard-api.service";
import type { DashboardMetricsDto } from "../../application/dto/metrics.dto";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useDashboardMetrics() {
  const query = useQuery<DashboardMetricsDto, Error>({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => dashboardApiService.getMetrics(),
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    retry: 1,
  });

  return {
    metrics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
