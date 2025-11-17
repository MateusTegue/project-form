'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import ShareLinkInput from './ShareLinkInput';
import ShareLinkActions from './ShareLinkActions';

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: string;
  formName: string;
  copied: boolean;
  onCopy: () => void;
  onOpenInNewTab: () => void;
  onShare: () => void;
  trigger: React.ReactNode;
}

export default function ShareLinkDialog({
  open,
  onOpenChange,
  link,
  formName,
  copied,
  onCopy,
  onOpenInNewTab,
  onShare,
  trigger,
}: ShareLinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="w-[30%] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Compartir formulario
          </DialogTitle>
          <DialogDescription>
            Comparte este enlace para que otros accedan a:{' '}
            <strong className="text-foreground">{formName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <ShareLinkInput 
            link={link}
            copied={copied}
            onCopy={onCopy}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Este enlace es público y puede ser compartido con cualquier persona.
            </AlertDescription>
          </Alert>

          <ShareLinkActions
            onCopy={onCopy}
            onOpenInNewTab={onOpenInNewTab}
            onShare={onShare}
            copied={copied}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}