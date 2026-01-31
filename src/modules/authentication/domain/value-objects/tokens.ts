import { ValueObject } from "@/shared/domain";

interface TokensProps {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export class Tokens extends ValueObject<TokensProps> {
  private constructor(props: TokensProps) {
    super(props);
  }

  static create(
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
  ): Tokens {
    return new Tokens({ accessToken, refreshToken, expiresAt });
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  isExpired(): boolean {
    return new Date() >= this.props.expiresAt;
  }

  isAboutToExpire(thresholdMs: number = 60000): boolean {
    const timeUntilExpiry = this.props.expiresAt.getTime() - Date.now();
    return timeUntilExpiry <= thresholdMs;
  }
}
