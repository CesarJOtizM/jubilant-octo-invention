import type {
  IntegrationProvider,
  ConnectionStatus,
  SyncStrategy,
  SyncDirection,
  ContactResolutionMode,
} from "@/modules/integrations/domain/entities/integration-connection.entity";

export interface IntegrationConnectionResponseDto {
  id: string;
  provider: IntegrationProvider;
  accountName: string;
  storeName: string;
  status: ConnectionStatus;
  syncStrategy: SyncStrategy;
  syncDirection: SyncDirection;
  defaultWarehouseId: string;
  warehouseName?: string | null;
  defaultContactId?: string | null;
  defaultContactName?: string | null;
  contactResolutionMode?: ContactResolutionMode | null;
  companyId?: string | null;
  companyName?: string | null;
  connectedAt?: string | null;
  lastSyncAt?: string | null;
  lastSyncError?: string | null;
  syncedOrdersCount: number;
  webhookSecret?: string | null;
  webhookUrl?: string | null;
  tokenStatus?: string | null;
  meliUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConnectionListResponseDto {
  success: boolean;
  message: string;
  data: IntegrationConnectionResponseDto[];
  timestamp: string;
}

export interface IntegrationConnectionDetailResponseDto {
  success: boolean;
  message: string;
  data: IntegrationConnectionResponseDto;
  timestamp: string;
}

export interface CreateIntegrationConnectionDto {
  provider: IntegrationProvider;
  accountName: string;
  storeName: string;
  appKey: string;
  appToken: string;
  syncStrategy: SyncStrategy;
  syncDirection: SyncDirection;
  defaultWarehouseId: string;
  defaultContactId?: string;
  contactResolutionMode?: ContactResolutionMode;
  companyId?: string;
  syncFromDate?: string;
  orderStatuses?: string;
}

export interface UpdateIntegrationConnectionDto {
  storeName?: string;
  appKey?: string;
  appToken?: string;
  syncStrategy?: SyncStrategy;
  syncDirection?: SyncDirection;
  defaultWarehouseId?: string;
  defaultContactId?: string;
  contactResolutionMode?: ContactResolutionMode;
  companyId?: string;
}

export interface IntegrationConnectionFilters {
  provider?: IntegrationProvider;
  status?: ConnectionStatus;
}

export interface TestConnectionResponseDto {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface TriggerSyncResponseDto {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface MeliAuthUrlResponseDto {
  success: boolean;
  message: string;
  data: { authUrl: string };
  timestamp: string;
}
