'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface ShareLinkInputProps {
  link: string;
  copied: boolean;
  onCopy: () => void;
}

export default function ShareLinkInput({ link, copied, onCopy }: ShareLinkInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="link" className="text-sm font-medium">
        Enlace público
      </Label>
      <div className="flex gap-2">
        <Input
          id="link"
          value={link}
          readOnly
          className="flex-1 font-mono text-xs"
          onClick={(e) => e.currentTarget.select()}
        />
        <Button
          type="button"
          size="icon"
          onClick={onCopy}
          variant={copied ? "default" : "outline"}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">
            {copied ? 'Copiado' : 'Copiar enlace'}
          </span>
        </Button>
      </div>
      {copied && (
        <p className="text-xs text-green-600 animate-in fade-in duration-200">
          ✓ Enlace copiado al portapapeles
        </p>
      )}
    </div>
  );
}