import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import { env } from "@/config/env";

export const UPLOAD_FOLDERS = [
  "products",
  "banners",
  "brands",
  "categories",
  "settings",
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export class CloudinaryConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryConfigError";
  }
}

export class CloudinaryUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryUploadError";
  }
}

let configured = false;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret
  );
}

export function ensureCloudinaryConfigured(): void {
  if (!isCloudinaryConfigured()) {
    throw new CloudinaryConfigError(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
}

function configureCloudinary(): void {
  if (configured) return;

  ensureCloudinaryConfigured();

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });

  configured = true;
}

export function isAllowedUploadFolder(folder: string): folder is UploadFolder {
  return UPLOAD_FOLDERS.includes(folder as UploadFolder);
}

export function validateUploadFile(file: File): void {
  if (!file || file.size === 0) {
    throw new CloudinaryUploadError("No file provided.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new CloudinaryUploadError("Image must be 5 MB or smaller.");
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new CloudinaryUploadError("Only JPEG, PNG, WebP, GIF, and SVG images are allowed.");
  }
}

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

function mapUploadResult(result: UploadApiResponse): CloudinaryUploadResult {
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function uploadImageBuffer(
  buffer: Buffer,
  options: {
    folder: UploadFolder;
    filename?: string;
    mimeType?: string;
  }
): Promise<CloudinaryUploadResult> {
  configureCloudinary();

  const folderPath = `glowcart/${options.folder}`;

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
        use_filename: Boolean(options.filename),
        filename_override: options.filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(
            new CloudinaryUploadError(
              error instanceof Error ? error.message : "Cloudinary upload failed."
            )
          );
          return;
        }

        resolve(mapUploadResult(result));
      }
    );

    upload.end(buffer);
  });
}

export async function uploadImageFile(
  file: File,
  folder: UploadFolder
): Promise<CloudinaryUploadResult> {
  validateUploadFile(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadImageBuffer(buffer, {
    folder,
    filename: file.name.replace(/\.[^.]+$/, ""),
    mimeType: file.type,
  });
}
