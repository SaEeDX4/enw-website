import React from 'react';
import styles from './FormField.module.css';

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  options = [],
  rows = 4,
  className = '',
  ...props
}) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hasError = touched && error;

  // Support BOTH handler signatures:
  // - event style: onChange(e) / onBlur(e)
  // - name/value style: onChange(name, value) / onBlur(name)
  const safeCallChange = (e, nextValue) => {
    if (!onChange) return;
    try {
      onChange(e);
    } catch {
      try {
        onChange(name, nextValue);
      } catch {}
    }
  };

  const safeCallBlur = (e) => {
    if (!onBlur) return;
    try {
      onBlur(e);
    } catch {
      try {
        onBlur(name);
      } catch {}
    }
  };

  const handleChange = (e) => {
    const nextValue = type === 'checkbox' ? e.target.checked : e.target.value;
    safeCallChange(e, nextValue);
  };

  const handleBlur = (e) => {
    safeCallBlur(e);
  };

  const commonProps = {
    id: fieldId,
    name,
    onChange: handleChange,
    onBlur: handleBlur,
    disabled,
    placeholder,
    className: `${styles.input} ${hasError ? styles.inputError : ''} ${className}`,
    'aria-describedby': hasError ? errorId : undefined,
    'aria-invalid': hasError ? 'true' : 'false',
    ...props,
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value ?? ''}
            rows={rows}
            className={`${styles.textarea} ${hasError ? styles.inputError : ''} ${className}`}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value ?? ''}
            className={`${styles.select} ${hasError ? styles.inputError : ''} ${className}`}
          >
            <option value="">Choose an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className={styles.checkboxWrapper}>
            <input
              {...commonProps}
              type="checkbox"
              checked={!!value}
              onChange={(e) => {
                // Capture once, then send a stable event-like payload
                const checked = e.target.checked;
                const eventLike = {
                  target: {
                    name,
                    type: 'checkbox',
                    checked,
                    value: checked,
                  },
                };
                safeCallChange(eventLike, checked);
              }}
              className={styles.checkbox}
            />
            <span className={styles.checkmark}></span>
          </div>
        );

      default:
        return <input {...commonProps} type={type} value={value ?? ''} />;
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`${styles.formField} ${styles.checkboxField}`}>
        <label htmlFor={fieldId} className={styles.checkboxLabel}>
          {renderField()}
          <span className={styles.labelText}>
            {label}
            {required && (
              <span className={styles.required} aria-label="required">
                *
              </span>
            )}
          </span>
        </label>
        {hasError && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.formField}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-label="required">
            *
          </span>
        )}
      </label>
      {renderField()}
      {hasError && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
