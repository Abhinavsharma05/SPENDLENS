const express = require('express');
const router = express.Router();
const { nanoid } = require("nanoid");
const { generateSummary } = require("../services/summaryService");
const { createAudit, getAuditByPublicId } = require("../services/dbService");

// Save initial audit
router.post("/", async (req, res) => {
  const { auditData, aiSummary } = req.body;
  if (!auditData) return res.status(400).json({ error: "Missing audit data" });

  const publicId = nanoid(10);
  try {
    await createAudit({
      publicId,
      toolsData: auditData.toolResults,
      savingsData: {
        totalMonthlySavings: auditData.totalMonthlySavings,
        totalAnnualSavings: auditData.totalAnnualSavings
      },
      aiSummary,
      teamSize: auditData.originalData?.teamSize?.toString(),
    });
    res.json({ publicId });
  } catch (error) {
    console.error("Save Audit Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
