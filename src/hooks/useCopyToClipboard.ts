import { useState, useCallback, useRef } from 'react';

interface UseCopyToClipboardResult {
  copied: boolean;
  copyToClipboard: (text: string) => void;
  fallbackUrl: string | null;
}

export const useCopyToClipboard = (resetMs: number = 2000): UseCopyToClipboardResult => {
  const [copied, setCopied] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = useCallback((text: string): void => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setFallbackUrl(null);
        timerRef.current = setTimeout(() => setCopied(false), resetMs);
      }).catch(() => {
        setFallbackUrl(text);
      });
    } else {
      setFallbackUrl(text);
    }
  }, [resetMs]);

  return { copied, copyToClipboard, fallbackUrl };
};
