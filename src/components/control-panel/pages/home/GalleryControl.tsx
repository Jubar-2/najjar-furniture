"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetGallery,
  useUploadGalleryImages,
  useDeleteGalleryImage,
  type GalleryImage,
} from "@/customHooks/getGallery";
import GalleryRowEditor, { type Row } from "./GalleryRowEditor";
import { convertImagesToWebp } from "@/lib/clientImageToWebp";

export default function GalleryAdmin() {
  const { data: gallery, isLoading, error: queryError } = useGetGallery();
  const uploadMutation = useUploadGalleryImages();
  const deleteMutation = useDeleteGalleryImage();

  const [uploadingRow, setUploadingRow] = useState<Row | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ image: GalleryImage; row: Row } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(row: Row, files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploadingRow(row);
    setErrorMessage(null);
    try {
      const convertedFiles = await convertImagesToWebp(files);
      const formData = new FormData();
      convertedFiles.forEach((file) => formData.append(row, file));

      await uploadMutation.mutateAsync(formData);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { error?: string } }; message?: string };
      setErrorMessage(errObj?.response?.data?.error ?? errObj?.message ?? "Upload failed.");
    } finally {
      setUploadingRow(null);
      if (mainInputRef.current) mainInputRef.current.value = "";
      if (subInputRef.current) subInputRef.current.value = "";
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setErrorMessage(null);
    try {
      await deleteMutation.mutateAsync({
        publicId: deleteTarget.image.publicId,
        row: deleteTarget.row,
      });
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { error?: string } }; message?: string };
      setErrorMessage(errObj?.response?.data?.error ?? errObj?.message ?? "Delete failed.");
    }
  }

  const isDeleting = deleteMutation.isPending;
  const displayError = errorMessage || (queryError instanceof Error ? queryError.message : null);

  if (isLoading) {
    return <p className="p-6 text-sm text-neutral-500">Loading gallery…</p>;
  }

  return (
    <div className="space-y-8 p-6">
      {displayError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {displayError}
        </div>
      )}

      <GalleryRowEditor
        title="Main Images"
        row="images"
        images={gallery?.images ?? []}
        isUploading={uploadingRow === "images"}
        inputRef={mainInputRef}
        onUpload={(files) => handleUpload("images", files)}
        onRequestDelete={(image) => setDeleteTarget({ image, row: "images" })}
      />

      <GalleryRowEditor
        title="Sub Images"
        row="imagesSub"
        images={gallery?.imagesSub ?? []}
        isUploading={uploadingRow === "imagesSub"}
        inputRef={subInputRef}
        onUpload={(files) => handleUpload("imagesSub", files)}
        onRequestDelete={(image) => setDeleteTarget({ image, row: "imagesSub" })}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from the gallery and permanently deletes the file from Cloudinary.
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}