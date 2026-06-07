import { auth } from "@/auth";

export const runtime = "nodejs";

import { ApiRouteError, apiError, apiSuccess } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import {
  CloudinaryConfigError,
  CloudinaryUploadError,
  isAllowedUploadFolder,
  uploadImageFile,
} from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!isAdmin(session)) {
      return apiError("Admin access required.", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      throw new ApiRouteError("No file provided.", 400);
    }

    if (typeof folder !== "string" || !isAllowedUploadFolder(folder)) {
      throw new ApiRouteError("Invalid upload folder.", 400);
    }

    const result = await uploadImageFile(file, folder);

    return apiSuccess(result, {
      status: 201,
      message: "Image uploaded successfully.",
    });
  } catch (error) {
    if (error instanceof CloudinaryConfigError) {
      return apiError(error.message, { status: 503 });
    }

    if (error instanceof CloudinaryUploadError) {
      return apiError(error.message, { status: 400 });
    }

    if (error instanceof ApiRouteError) {
      return apiError(error.message, { status: error.status });
    }

    return apiError("Upload failed.", { status: 500 });
  }
}
