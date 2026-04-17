"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/ui/components/button";

interface WebhookCredentialsDisplayProps {
  webhookUrl: string | null;
  webhookSecret: string | null;
}

/**
 * Displays the absolute webhook URL and the shared secret the user must
 * copy into the external provider (VTEX, MercadoLibre) to register the
 * webhook. Both values render as a dt/dd row inside a surrounding <dl>,
 * so this component assumes it is mounted inside a description list.
 *
 * The URL is always rendered in plaintext — it is not a secret. The
 * secret is masked by default and revealed only on user action.
 */
export function WebhookCredentialsDisplay({
  webhookUrl,
  webhookSecret,
}: WebhookCredentialsDisplayProps) {
  const t = useTranslations("integrations");
  const [showSecret, setShowSecret] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const handleCopy = async (
    value: string,
    setCopied: (v: boolean) => void,
    successMessage: string,
  ) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(successMessage);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {webhookUrl && (
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-sm font-medium text-muted-foreground">
            {t("fields.webhookUrl")}
          </dt>
          <dd className="mt-1 flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-sm font-mono">
              {webhookUrl}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                handleCopy(
                  webhookUrl,
                  setUrlCopied,
                  t("detail.webhookUrlCopied"),
                )
              }
              aria-label={t("detail.webhookUrlCopied")}
            >
              {urlCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </dd>
        </div>
      )}

      {webhookSecret && (
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-sm font-medium text-muted-foreground">
            {t("fields.webhookSecret")}
          </dt>
          <dd className="mt-1 flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
              {showSecret ? webhookSecret : "\u2022".repeat(32)}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSecret(!showSecret)}
              aria-label={showSecret ? "Hide secret" : "Show secret"}
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                handleCopy(
                  webhookSecret,
                  setSecretCopied,
                  t("detail.webhookSecretCopied"),
                )
              }
              aria-label={t("detail.webhookSecretCopied")}
            >
              {secretCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </dd>
        </div>
      )}
    </>
  );
}
