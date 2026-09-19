"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  value?: string;                     // controlled image url (optional)
  onChange?: (file: File | null, previewUrl: string | null) => void;
  className?: string;
  aspect?: "square" | "video" | "auto";
}

export default function ImageUpload({
  value,
  onChange,
  className = "",
  aspect = "video",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(file, url);
    },
    [onChange]
  );

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "video" ? "aspect-video" : "";

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <Card className={`relative overflow-hidden group ${aspectClass}`}>
          <Image
            src={preview}
            alt="Uploaded preview"
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-4 mr-1" />
              Replace
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleRemove}>
              <X className="size-4 mr-1" />
              Remove
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`${aspectClass} flex flex-col items-center justify-center gap-2 border-2 border-dashed cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <ImageIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click or drag an image here
          </p>
        </Card>
      )}
    </div>
  );
}