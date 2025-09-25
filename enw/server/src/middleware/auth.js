// Simple stub auth middleware (you can extend later)
export const requireApiKey = (req, res, next) => {
  const key = req.header("x-api-key");
  const expected = process.env.API_KEY;
  if (expected && key !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};
