export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
} as const;

export { getMockUsers, findMockUserByEmail, addMockUser } from "./mock-users";
export { hasRole, isAdmin, isCustomer, getUserRole, requireRole } from "./roles";
export {
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
} from "./validation";
export { protectedRoutes, authRoutes, isProtectedPath, isAuthPath } from "./protected-routes";
