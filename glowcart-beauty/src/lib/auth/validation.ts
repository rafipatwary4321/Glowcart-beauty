export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "Email is required.";
  if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export function validateLoginForm(input: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;

  if (!input.password) errors.password = "Password is required.";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name.trim()) errors.name = "Name is required.";

  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(input.password);
  if (passwordError) errors.password = passwordError;

  if (!input.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateForgotPasswordForm(input: { email: string }): ValidationResult {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateResetPasswordForm(input: {
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const passwordError = validatePassword(input.password);
  if (passwordError) errors.password = passwordError;

  if (!input.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
