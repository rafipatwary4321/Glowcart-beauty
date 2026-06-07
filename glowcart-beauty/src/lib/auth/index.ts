export { authConfig } from "@/auth.config";
export { hasRole, isAdmin, isCustomer, getUserRole, requireRole } from "./roles";
export {
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
} from "./validation";
export {
  protectedRoutes,
  authRoutes,
  isProtectedPath,
  isAuthPath,
  isAdminPath,
  adminRoutePrefix,
} from "./protected-routes";
export {
  authenticateUser,
  registerUser,
  findUserByEmail,
  findUserById,
  findOrCreateOAuthUser,
  ensureAdminSeedUser,
} from "./user-service";
export type { SafeUser } from "./user-service";
export { getPostLoginRedirect, getDefaultAuthCallbackUrl } from "./redirect";
