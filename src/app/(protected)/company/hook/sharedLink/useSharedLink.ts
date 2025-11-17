import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useShareLink(token: string) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  
  const link = typeof window !== 'undefined' 
    ? `${window.location.origin}/form/${token}`
    : '';

  const handleCopy = useCallback(async () => {
    try {
      
      if (!navigator.clipboard) {
        throw new Error('Clipboard API no disponible');
      }

      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('¡Enlace copiado al portapapeles!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback: seleccionar y copiar
      try {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        toast.success('¡Enlace copiado!');
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        toast.error('Error al copiar el enlace');
      }
    }
  }, [link]);

  const handleOpenInNewTab = useCallback(() => {    
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No se pudo generar el enlace');
    }
  }, [link]);

  const handleShare = useCallback(async () => {
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Formulario',
          text: 'Completa este formulario',
          url: link,
        });
        toast.success('¡Compartido exitosamente!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error('Error al compartir');
        }
      }
    } else {
      // Fallback: copiar al portapapeles
      await handleCopy();
    }
  }, [link, handleCopy]);

  return {
    link,
    copied,
    open,
    setOpen,
    handleCopy,
    handleOpenInNewTab,
    handleShare,
  };
}