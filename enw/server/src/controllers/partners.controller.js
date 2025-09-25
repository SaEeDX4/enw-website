import Partner from "../models/partner.model.js";

// Simple healthcheck
export const ping = (req, res) => {
  res.json({ ok: true, who: "partners" });
};

// FIX: createPartner controller
export const createPartner = async (req, res) => {
  try {
    // Normalize consent to boolean
    const payload = { ...req.body, consent: !!req.body.consent };

    const partner = await Partner.create(payload);

    return res.status(201).json({
      message: "Partner application submitted successfully",
      data: partner,
    });
  } catch (err) {
    console.error("❌ Error creating partner:", err);

    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation failed", details: err.errors });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Duplicate key", key: err.keyValue });
    }

    return res.status(500).json({ error: "Server error" });
  }
};
