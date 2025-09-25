// server/src/utils/mongoErrors.js
export function isDuplicateKeyError(err) {
  return err && err.code === 11000; // Mongo duplicate key
}

export function getDuplicateDetails(err) {
  // Works for single-field unique indexes like { email: 1 }
  const field = err?.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
  const value = field && err?.keyValue ? err.keyValue[field] : undefined;
  return { field, value };
}

// Optional: format mongoose validation errors -> { field: msg }
export function formatValidationErrors(err) {
  if (err?.name !== "ValidationError") return null;
  const out = {};
  for (const [path, detail] of Object.entries(err.errors || {})) {
    out[path] = detail?.message || "Invalid value";
  }
  return out;
}
