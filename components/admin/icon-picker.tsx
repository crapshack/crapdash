'use client';

import { useState } from 'react';
import { ImageIcon, Shapes } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { IconUpload } from './icon-upload';
import { LucideIconPicker } from './lucide-icon-picker';
import { ICON_TYPES, type IconConfig, type IconType } from '@/lib/types';

interface IconPickerProps {
  value?: IconConfig;
  pendingFile?: File | null;
  onValueChange: (value: IconConfig | undefined) => void;
  onFileSelect: (file: File | null) => void;
  onClear: () => void;
  cacheKey?: number;
}

export function IconPicker({
  value,
  pendingFile,
  onValueChange,
  onFileSelect,
  onClear,
  cacheKey,
}: IconPickerProps) {
  const [iconType, setIconType] = useState<IconType>(value?.type ?? ICON_TYPES.IMAGE);

  const handleTypeChange = (newType: string) => {
    if (!newType) return;
    const type = newType as IconType;
    setIconType(type);
    // Clear the current value when switching types
    onFileSelect(null);
    onClear();
  };

  // Wrap onFileSelect to also notify parent about icon type
  const handleImageFileSelect = (file: File | null) => {
    onFileSelect(file);
    if (file) {
      // Signal that we're using an image type icon (actual path will be set after upload)
      onValueChange({ type: ICON_TYPES.IMAGE, value: '' });
    }
  };

  const handleLucideIconChange = (iconName: string) => {
    if (!iconName) {
      onValueChange(undefined);
    } else {
      onValueChange({ type: ICON_TYPES.ICON, value: iconName });
    }
  };

  // For image type, extract the value path
  const imageValue = value?.type === ICON_TYPES.IMAGE ? value.value : undefined;

  // For Lucide type
  const lucideIconName = value?.type === ICON_TYPES.ICON ? value.value : '';

  return (
    <div className="space-y-4">
      {/* Type Toggle */}
      <ToggleGroup
        type="single"
        value={iconType}
        onValueChange={handleTypeChange}
        variant="outline"
      >
        <ToggleGroupItem value={ICON_TYPES.IMAGE} className="flex-1 gap-2">
          <ImageIcon className="size-4" />
          Image
        </ToggleGroupItem>
        <ToggleGroupItem value={ICON_TYPES.ICON} className="flex-1 gap-2">
          <Shapes className="size-4" />
          Lucide
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Image Upload */}
      {iconType === ICON_TYPES.IMAGE && (
        <IconUpload
          value={imageValue}
          pendingFile={pendingFile}
          onFileSelect={handleImageFileSelect}
          onClear={onClear}
          cacheKey={cacheKey}
        />
      )}

      {/* Lucide Icon Picker */}
      {iconType === ICON_TYPES.ICON && (
        <LucideIconPicker
          value={lucideIconName}
          onChange={handleLucideIconChange}
        />
      )}
    </div>
  );
}
