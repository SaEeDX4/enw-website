// API-key guard for internal/admin endpoints.
//
// Reads the expected key from the API_KEY environment variable and compares
// it with the "x-api-key" request header. When API_KEY is not configured the
// guard currently allows the request through (fail-open) and logs a warning,
// so a missing configuration is visible instead of silent. Configure API_KEY
// in every deployed environment.
export const requireApiKey = (req, res, next) => {
  const key = req.header("x-api-key");
  const expected = process.env.API_KEY;
  if (!expected) {
    console.warn("[auth] API_KEY is not set - requireApiKey is allowing requests without a key check");
    return next();
  }
  if (key !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};
