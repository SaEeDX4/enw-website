// src/hooks/useForm.js
import { useCallback, useMemo, useState } from 'react';

export function useForm(initialValues = {}, fieldValidationRules = {}) {
  const [formData, setFormData] = useState({ ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validators = useMemo(
    () => fieldValidationRules || {},
    [fieldValidationRules]
  );

  const validateField = useCallback(
    (name, value) => {
      const rules = validators[name] || [];
      for (const rule of rules) {
        const result = typeof rule === 'function' ? rule(value) : true;
        if (result !== true) return result || 'Invalid value';
      }
      return true;
    },
    [validators]
  );

  const validateAll = useCallback(
    (data) => {
      const nextErrors = {};
      for (const key of Object.keys(validators)) {
        const res = validateField(key, data[key]);
        if (res !== true) nextErrors[key] = res;
      }
      return nextErrors;
    },
    [validators, validateField]
  );

  // Accepts EITHER updateField(event) OR updateField(name, value)
  const updateField = useCallback(
    (arg1, arg2) => {
      let name, value;

      if (arg1 && typeof arg1 === 'object' && arg1.target) {
        const e = arg1;
        name = e.target.name;
        value =
          e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      } else {
        name = arg1;
        value = arg2;
      }

      if (typeof name !== 'string') return;

      setFormData((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      const res = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: res === true ? undefined : res,
      }));
    },
    [validateField]
  );

  // Accepts EITHER touchField(event) OR touchField(name)
  const touchField = useCallback(
    (arg) => {
      const name = arg && arg.target ? arg.target.name : arg;
      if (typeof name !== 'string') return;

      setTouched((prev) => ({ ...prev, [name]: true }));
      const res = validateField(name, formData[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: res === true ? undefined : res,
      }));
    },
    [formData, validateField]
  );

  const reset = useCallback(() => {
    setFormData({ ...initialValues });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Curried submit: use directly as onSubmit={handleSubmit(onSubmit)}
  const handleSubmit = useCallback(
    (onValid) => {
      return async (evt) => {
        if (evt?.preventDefault) evt.preventDefault();

        const nextErrors = validateAll(formData);
        setErrors(nextErrors);

        const hasError = Object.values(nextErrors).some(Boolean);
        if (hasError) {
          const allTouched = Object.keys(validators).reduce((acc, k) => {
            acc[k] = true;
            return acc;
          }, {});
          setTouched(allTouched);
          return;
        }

        try {
          setIsSubmitting(true);
          await Promise.resolve(onValid?.(formData));
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [formData, validateAll, validators]
  );

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    updateField,
    touchField,
    handleSubmit,
    reset,
  };
}
