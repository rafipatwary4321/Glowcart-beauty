import { connectDB } from "@/lib/db";
import {
  getErrorDetails,
  getErrorMessage,
  getErrorStatus,
} from "@/lib/api/errors";
import { apiError } from "@/lib/api/response";

type RouteHandler = (request: Request, context?: unknown) => Promise<Response>;

export function withDb(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      await connectDB();
      return await handler(request, context);
    } catch (error) {
      return apiError(getErrorMessage(error), {
        status: getErrorStatus(error),
        details: getErrorDetails(error),
      });
    }
  };
}
