import { Entity } from "@/shared/domain";

export type IntegrationProvider = "VTEX" | "MERCADOLIBRE";
export type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "ERROR";
export type SyncStrategy = "WEBHOOK" | "POLLING" | "BOTH";
export type SyncDirection = "INBOUND" | "OUTBOUND" | "BIDIRECTIONAL";
// Mirrors backend IntegrationConnection.TokenStatus.
// Transitions: PENDING_AUTH -> VALID -> REFRESHING -> VALID | REAUTH_REQUIRED.
// VTEX connections stay null (no OAuth).
export type TokenStatus =
  | "PENDING_AUTH"
  | "VALID"
  | "REFRESHING"
  | "REAUTH_REQUIRED";

/**
 * Controls how a contact is resolved when an incoming order is synced.
 *
 * AUTO         — look up the buyer by email / document; create a new contact
 *                if none is found. Falls back to defaultContactId on error.
 * DEFAULT_ONLY — always use defaultContactId; buyer data is ignored entirely.
 */
export type ContactResolutionMode = "AUTO" | "DEFAULT_ONLY";

export interface IntegrationConnectionProps {
  id: string;
  provider: IntegrationProvider;
  accountName: string;
  storeName: string;
  status: ConnectionStatus;
  syncStrategy: SyncStrategy;
  syncDirection: SyncDirection;
  defaultWarehouseId: string;
  warehouseName: string | null;
  defaultContactId: string | null;
  defaultContactName: string | null;
  contactResolutionMode: ContactResolutionMode;
  companyId: string | null;
  companyName: string | null;
  connectedAt: Date | null;
  lastSyncAt: Date | null;
  lastSyncError: string | null;
  syncedOrdersCount: number;
  webhookSecret: string | null;
  webhookUrl: string | null;
  tokenStatus: TokenStatus | null;
  meliUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class IntegrationConnection extends Entity<string> {
  private readonly props: Omit<IntegrationConnectionProps, "id">;

  private constructor(
    id: string,
    props: Omit<IntegrationConnectionProps, "id">,
  ) {
    super(id);
    this.props = props;
  }

  static create(props: IntegrationConnectionProps): IntegrationConnection {
    return new IntegrationConnection(props.id, {
      provider: props.provider,
      accountName: props.accountName,
      storeName: props.storeName,
      status: props.status,
      syncStrategy: props.syncStrategy,
      syncDirection: props.syncDirection,
      defaultWarehouseId: props.defaultWarehouseId,
      warehouseName: props.warehouseName,
      defaultContactId: props.defaultContactId,
      defaultContactName: props.defaultContactName,
      contactResolutionMode: props.contactResolutionMode,
      companyId: props.companyId,
      companyName: props.companyName,
      connectedAt: props.connectedAt,
      lastSyncAt: props.lastSyncAt,
      lastSyncError: props.lastSyncError,
      syncedOrdersCount: props.syncedOrdersCount,
      webhookSecret: props.webhookSecret,
      webhookUrl: props.webhookUrl,
      tokenStatus: props.tokenStatus,
      meliUserId: props.meliUserId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get provider(): IntegrationProvider {
    return this.props.provider;
  }
  get accountName(): string {
    return this.props.accountName;
  }
  get storeName(): string {
    return this.props.storeName;
  }
  get status(): ConnectionStatus {
    return this.props.status;
  }
  get syncStrategy(): SyncStrategy {
    return this.props.syncStrategy;
  }
  get syncDirection(): SyncDirection {
    return this.props.syncDirection;
  }
  get defaultWarehouseId(): string {
    return this.props.defaultWarehouseId;
  }
  get warehouseName(): string | null {
    return this.props.warehouseName;
  }
  get defaultContactId(): string | null {
    return this.props.defaultContactId;
  }
  get defaultContactName(): string | null {
    return this.props.defaultContactName;
  }
  get contactResolutionMode(): ContactResolutionMode {
    return this.props.contactResolutionMode;
  }
  get companyId(): string | null {
    return this.props.companyId;
  }
  get companyName(): string | null {
    return this.props.companyName;
  }
  get connectedAt(): Date | null {
    return this.props.connectedAt;
  }
  get lastSyncAt(): Date | null {
    return this.props.lastSyncAt;
  }
  get lastSyncError(): string | null {
    return this.props.lastSyncError;
  }
  get syncedOrdersCount(): number {
    return this.props.syncedOrdersCount;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get webhookSecret(): string | null {
    return this.props.webhookSecret;
  }
  get webhookUrl(): string | null {
    return this.props.webhookUrl;
  }
  get tokenStatus(): TokenStatus | null {
    return this.props.tokenStatus;
  }
  get meliUserId(): string | null {
    return this.props.meliUserId;
  }

  toJSON() {
    return { id: this._id, ...this.props };
  }

  get isConnected(): boolean {
    return this.props.status === "CONNECTED";
  }
  get hasError(): boolean {
    return this.props.status === "ERROR";
  }
  get needsReauth(): boolean {
    return this.props.tokenStatus === "REAUTH_REQUIRED";
  }
}
