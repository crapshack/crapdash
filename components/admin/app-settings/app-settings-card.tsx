'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { uploadAppLogo, updateAppSettings } from '@/lib/actions';
import { DEFAULT_APP_TITLE, ICON_TYPES, type IconConfig, type ActionResult } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AppSettingsCardProps {
  appTitle?: string;
  appLogo?: IconConfig;
  onChange?: (nextTitle?: string, nextLogo?: IconConfig) => void;
}

export function AppSettingsCard({ appTitle, appLogo, onChange }: AppSettingsCardProps) {
  const [title, setTitle] = useState(appTitle?.trim() || DEFAULT_APP_TITLE);
  const [logo, setLogo] = useState<IconConfig | undefined>(appLogo);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = useMemo(() => {
    const currentTitle = title?.trim() || '';
    const savedTitle = appTitle?.trim() || DEFAULT_APP_TITLE;
    const titleChanged = currentTitle !== savedTitle;
    const logoChanged = pendingFile !== null || removeLogo;
    return titleChanged || logoChanged;
  }, [appTitle, pendingFile, removeLogo, title]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setRemoveLogo(false);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveClick = () => {
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    setLogo(undefined);
    setRemoveLogo(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowRemoveConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    let nextLogoToPersist: IconConfig | null | undefined;

    if (pendingFile) {
      const formData = new FormData();
      formData.append('file', pendingFile);

      const uploadResult = await uploadAppLogo(formData);
      if (!uploadResult.success) {
        toast.error(uploadResult.errors[0]?.message ?? 'Failed to upload logo');
        setIsSaving(false);
        return;
      }

      nextLogoToPersist = { type: ICON_TYPES.IMAGE, value: uploadResult.data };
    } else if (removeLogo) {
      nextLogoToPersist = null;
    }

    const titleToPersist = title.trim();
    const result: ActionResult<{ appTitle?: string; appLogo?: IconConfig }> = await updateAppSettings({
      appTitle: titleToPersist.length > 0 && titleToPersist !== DEFAULT_APP_TITLE ? titleToPersist : null,
      appLogo: nextLogoToPersist,
    });

    if (!result.success) {
      toast.error(result.errors[0]?.message ?? 'Failed to save');
      setIsSaving(false);
      return;
    }

    const nextTitle = result.data.appTitle;
    const nextLogo = result.data.appLogo;

    setLogo(nextLogo);
    setPendingFile(null);
    setPreviewUrl(null);
    setRemoveLogo(false);
    setTitle(nextTitle?.trim() || DEFAULT_APP_TITLE);

    onChange?.(nextTitle, nextLogo ?? undefined);
    toast.success('Saved');
    setIsSaving(false);
  };

  const customLogoSrc = previewUrl || (logo?.type === ICON_TYPES.IMAGE ? `/api/${logo.value}` : null);
  const hasCustomLogo = !!customLogoSrc;

  return (
    <>
      <Card className="shadow-xs sm:w-fit">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className="relative h-14 w-14 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleLogoClick}
              >
                <Image
                  src={customLogoSrc || '/compy.png'}
                  alt="Logo"
                  fill
                  className="object-cover"
                  unoptimized={!!customLogoSrc}
                />
                <div className={cn(
                  "absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </div>
              {hasCustomLogo && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={handleRemoveClick}
                  className={cn(
                    "absolute -top-2 -right-2 h-5 w-5 rounded-full transition-opacity",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={DEFAULT_APP_TITLE}
              maxLength={100}
              disabled={isSaving}
              className="flex-1 sm:flex-none sm:w-48"
            />

            {hasChanges && (
              <Button type="submit" disabled={isSaving} className="h-9">
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove logo</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to remove your custom logo? This will reset to the default logo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
