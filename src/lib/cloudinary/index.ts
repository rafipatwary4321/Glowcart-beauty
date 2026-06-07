/**
 * Cloudinary upload and image transformation helpers.
 */
export async function uploadImage(_file: File): Promise<string> {
  // TODO: implement Cloudinary upload
  throw new Error("Cloudinary not configured");
}

export function getCloudinaryUrl(publicId: string, options?: { width?: number }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const transforms = options?.width ? `w_${options.width},c_fill/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}${publicId}`;
}
