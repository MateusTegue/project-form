'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { FieldOption } from '@/types/models';

interface FieldFormOptionItemProps {
  option: FieldOption;
  index: number;
  onChange: (index: number, key: keyof FieldOption, value: any) => void;
  onRemove: (index: number) => void;
}

export default function FieldFormOptionItem({ 
  option, 
  index, 
  onChange, 
  onRemove 
}: FieldFormOptionItemProps) {
  return (
    <Card>
      <CardContent className="pt-3 pb-3">
        <div className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Input 
              placeholder="Etiqueta" 
              value={option.label} 
              onChange={(e) => onChange(index, 'label', e.target.value)} 
            />
            <Input 
              placeholder="Valor" 
              value={option.value} 
              onChange={(e) => onChange(index, 'value', e.target.value)} 
            />
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}