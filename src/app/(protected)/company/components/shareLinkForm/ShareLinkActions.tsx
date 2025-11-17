'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Share2, Check } from 'lucide-react';

interface ShareLinkActionsProps {
  onCopy: () => void;
  onOpenInNewTab: () => void;
  onShare: () => void;
  copied: boolean;
}

export default function ShareLinkActions({
  onCopy,
  onOpenInNewTab,
  onShare,
  copied,
}: ShareLinkActionsProps) {
  // Detectar si el navegador soporta Web Share API
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"  // ⬅️ IMPORTANTE
        variant="outline"
        onClick={onOpenInNewTab}
        className="gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        <span>Vista previa</span>
      </Button>

      {canShare ? (
        <Button
          type="button"  // ⬅️ IMPORTANTE
          onClick={onShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Compartir</span>
        </Button>
      ) : (
        <Button
          type="button"  // ⬅️ IMPORTANTE
          onClick={onCopy}
          variant={copied ? "default" : "outline"}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copiar</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}