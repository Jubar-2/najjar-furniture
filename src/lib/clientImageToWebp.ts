/**
 * Client-side utility to convert uploaded image Files to WebP format in the browser
 * before transmitting them to the Next.js API and Cloudinary.
 *
 * Benefits:
 * 1. Reduces network payload size significantly (often 60–80% smaller than PNG/JPEG),
 *    preventing Netlify 413 "Payload Too Large" errors.
 * 2. Preserves natural dimensions, aspect ratio, and PNG alpha transparency.
 * 3. Does not upscale images.
 * 4. Yields a genuine WebP file with MIME type "image/webp" and filename ending in ".webp".
 */

export interface ConvertOptions {
  quality?: number; // 0 to 1, default 0.82 (82%)
}

const DEFAULT_QUALITY = 0.82;

/**
 * Checks if a File has already been processed by this utility to avoid double-compression.
 */
function isAlreadyProcessedWebp(file: File): boolean {
  return (
    (file as unknown as { __isConvertedWebp?: boolean }).__isConvertedWebp === true ||
    (file.type === "image/webp" && (file as unknown as { __isConvertedWebp?: boolean }).__isConvertedWebp === true)
  );
}

/**
 * Marks a File as having been converted by this utility.
 */
function tagAsConverted(file: File): File {
  Object.defineProperty(file, "__isConvertedWebp", {
    value: true,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  return file;
}

/**
 * Replaces the file's extension with ".webp".
 */
function getWebpFileName(originalName: string): string {
  const base = originalName.replace(/\.[^/.]+$/, "");
  return `${base || "image"}.webp`;
}

/**
 * Converts a single image File into an image/webp File.
 * Safe to run in SSR environments (returns file as-is when window is undefined).
 */
export async function convertImageToWebp(
  file: File,
  options?: ConvertOptions
): Promise<File> {
  const quality = options?.quality ?? DEFAULT_QUALITY;

  // SSR or non-browser guard
  if (typeof window === "undefined" || !file || !(file instanceof File)) {
    return file;
  }

  // Only process images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Prevent repeated compression on an already-converted file
  if (isAlreadyProcessedWebp(file)) {
    return file;
  }

  try {
    // Prefer createImageBitmap for performance and native off-main-thread decoding where available
    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap;

        if (width === 0 || height === 0) {
          bitmap.close();
          return file;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          bitmap.close();
          return file;
        }

        // Clear rect preserves transparency for PNGs with alpha channels
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/webp", quality);
        });

        if (blob) {
          const webpFile = new File([blob], getWebpFileName(file.name), {
            type: "image/webp",
            lastModified: Date.now(),
          });
          return tagAsConverted(webpFile);
        }
      } catch (err) {
        // Fallback to HTMLImageElement below if createImageBitmap fails on specific formats
        console.warn("createImageBitmap failed, trying HTMLImageElement fallback:", err);
      }
    }

    // HTMLImageElement fallback
    return await convertUsingImageElement(file, quality);
  } catch (err) {
    console.warn("WebP conversion failed, falling back to original file:", err);
    return file;
  }
}

/**
 * Fallback converter using HTMLImageElement.
 */
function convertUsingImageElement(file: File, quality: number): Promise<File> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width === 0 || height === 0) {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const webpFile = new File([blob], getWebpFileName(file.name), {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(tagAsConverted(webpFile));
          },
          "image/webp",
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        console.warn("convertUsingImageElement error:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Batch converts an array or FileList of image files to WebP.
 */
export async function convertImagesToWebp(
  files: File[] | FileList,
  options?: ConvertOptions
): Promise<File[]> {
  const fileArray = Array.from(files);
  return Promise.all(fileArray.map((f) => convertImageToWebp(f, options)));
}
