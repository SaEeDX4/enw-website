// client/src/utils/validation.js

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (flexible format)
export const isValidPhone = (phone) => {
  if (phone == null) return false;
  const str = String(phone).trim();

  // Keep digits and a single leading '+', drop spaces/dashes/()/. etc.
  const cleaned = str.replace(/[^\d+]/g, '');
  const normalized = cleaned.startsWith('+')
    ? '+' + cleaned.slice(1).replace(/\+/g, '') // ensure only one leading '+'
    : cleaned.replace(/\+/g, '');

  const digits = normalized.replace(/\D/g, '');

  // Accept common international/national lengths: 9–15 digits
  // (covers cases like '+37060000000' and '860000000')
  if (digits.length < 9 || digits.length > 15) return false;

  // If '+' exists, it must be only at the start
  if (normalized.includes('+') && !normalized.startsWith('+')) return false;

  return true;
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'boolean') return value === true; // for checkboxes
  return value != null && value.toString().trim().length > 0;
};

// Min length validation
export const minLength = (value, min) => {
  return value != null && value.toString().trim().length >= min;
};

// Max length validation
export const maxLength = (value, max) => {
  return value == null || value.toString().trim().length <= max;
};

// Age validation (18-120)
export const isValidAge = (age) => {
  const numAge = parseInt(age, 10);
  return Number.isFinite(numAge) && numAge >= 18 && numAge <= 120;
};

// Optional: enum validation (useful for selects)
export const oneOf =
  (allowed = []) =>
  (value) =>
    !value ||
    allowed.includes(value) ||
    `Must be one of: ${allowed.join(', ')}`;

// Validation rules
export const validationRules = {
  required: (value) => isRequired(value) || 'This field is required',
  email: (value) =>
    !value || isValidEmail(value) || 'Please enter a valid email address',
  phone: (value) =>
    !value || isValidPhone(value) || 'Please enter a valid phone number',
  minLength: (min) => (value) =>
    !value || minLength(value, min) || `Minimum ${min} characters required`,
  maxLength: (max) => (value) =>
    maxLength(value, max) || `Maximum ${max} characters allowed`,
  age: (value) =>
    !value || isValidAge(value) || 'Age must be between 18 and 120',
};

// Validate a single field
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) return result; // Return error message
  }
  return true; // Valid
};

// Validate entire form
export const validateForm = (formData, fieldRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(fieldRules).forEach((fieldName) => {
    const fieldValue = formData[fieldName];
    const rules = fieldRules[fieldName];
    const error = validateField(fieldValue, rules);

    if (error !== true) {
      errors[fieldName] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
