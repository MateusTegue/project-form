'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShareLink } from '../../hook/sharedLink/useSharedLink';
import ShareLinkDialog from './ShareLinkDialog';
import { ShareLinkFormProps } from '../../types/models';

export default function ShareLinkForm({ token, formName }: ShareLinkFormProps) {
  const {
    link,
    copied,
    open,
    setOpen,
    handleCopy,
    handleOpenInNewTab,
    handleShare,
  } = useShareLink(token);

  return (
    <ShareLinkDialog
      open={open}
      onOpenChange={setOpen}
      link={link}
      formName={formName}
      copied={copied}
      onCopy={handleCopy}
      onOpenInNewTab={handleOpenInNewTab}
      onShare={handleShare}
      trigger={
        <Button type="button" variant="outline" size="sm" className="w-full gap-2">
          <Share2 className="h-3 w-3" />
          Compartir enlace
        </Button>
      }
    />
  );
}