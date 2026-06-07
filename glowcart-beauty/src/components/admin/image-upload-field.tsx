"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { UploadFolder } from "@/lib/cloudinary";
import { uploadImageToCloudinary } from "@/lib/upload/client";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  folder: UploadFolder;
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  description?: string;
  fallbackGradient?: string;
  aspectClassName?: string;
  accept?: string;
};

export function ImageUploadField({
  folder,
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
  label = "Image",
  description,
  fallbackGradient = "from-rose-100 to-pink-50",
  aspectClassName = "aspect-square",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const canAddMore = multiple ? value.length < maxFiles : value.length === 0;

  async function handleFiles(selected: FileList | null) {
    if (!selected?.length) return;

    const files = Array.from(selected);
    const remainingSlots = multiple ? maxFiles - value.length : 1;
    const filesToUpload = files.slice(0, remainingSlots);

    if (!filesToUpload.length) {
      toast.error(`Maximum ${maxFiles} images allowed.`);
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        const result = await uploadImageToCloudinary(file, folder);
        uploadedUrls.push(result.url);
      }

      onChange(multiple ? [...value, ...uploadedUrls] : uploadedUrls);
      toast.success(
        uploadedUrls.length > 1
          ? `${uploadedUrls.length} images uploaded.`
          : "Image uploaded successfully."
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  const primaryPreview = value[0];

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {multiple && value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-xl border border-border/60">
              <div className="relative aspect-square bg-muted">
                <Image src={url} alt={`${label} ${index + 1}`} fill className="object-cover" sizes="160px" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 size-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeAt(index)}
                disabled={uploading}
                aria-label={`Remove image ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {!multiple ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-dashed border-border/70",
            aspectClassName,
            !primaryPreview && `bg-gradient-to-br ${fallbackGradient}`
          )}
        >
          {primaryPreview ? (
            <>
              <Image
                src={primaryPreview}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/50 to-transparent p-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  disabled={uploading}
                  onClick={() => onChange([])}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="rounded-full bg-background/80 p-3 shadow-sm">
                <ImagePlus className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Upload {label.toLowerCase()}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPEG, PNG, WebP, GIF up to 5 MB. Gradient used if empty.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={uploading || !canAddMore}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Choose file
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : null}

      {multiple && canAddMore ? (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Add image{value.length ? "s" : ""}
            </>
          )}
        </Button>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />
    </div>
  );
}
