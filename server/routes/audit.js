const express = require('express');
const router = express.Router();
const { generateSummary } = require("../services/summaryService");
const { getAuditByPublicId } = require("../services/dbService");

// Generate AI summary
router.post("/summary", async (req, res) => {
  const { auditData } = req.body;
  if (!auditData) return res.status(400).json({ error: "Missing audit data" });
  
  const summary = await generateSummary(auditData);
  res.json({ summary });
});

// Get shareable result
router.get("/:id", async (req, res) => {
  try {
    const audit = await getAuditByPublicId(req.params.id);
    if (!audit) return res.status(404).json({ error: "Audit not found" });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
