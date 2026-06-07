import type { UploadFolder } from "@/lib/cloudinary";

export type ClientUploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

type UploadApiResponse = {
  success: boolean;
  data?: ClientUploadResult;
  error?: string;
};

export async function uploadImageToCloudinary(
  file: File,
  folder: UploadFolder
): Promise<ClientUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const json = (await response.json()) as UploadApiResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Upload failed.");
  }

  return json.data;
}
