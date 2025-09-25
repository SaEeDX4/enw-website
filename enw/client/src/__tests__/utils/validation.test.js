import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  isValidAge,
  validateField,
  validateForm,
  validationRules,
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate various phone formats', () => {
      expect(isValidPhone('+37060000000')).toBe(true);
      expect(isValidPhone('860000000')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should check if value exists', () => {
      expect(isRequired('value')).toBe(true);
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', () => {
      const formData = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25,
      };

      const fieldRules = {
        email: [validationRules.required, validationRules.email],
        name: [validationRules.required, validationRules.minLength(2)],
        age: [validationRules.age],
      };

      const result = validateForm(formData, fieldRules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});
