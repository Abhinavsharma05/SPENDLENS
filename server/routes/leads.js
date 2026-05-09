const express = require('express');
const router = express.Router();
const { nanoid } = require("nanoid");
const { createAudit } = require("../services/dbService");
const { sendAuditConfirmation } = require("../services/emailService");

// Capture lead and save audit
router.post("/", async (req, res) => {
  const { auditData, leadInfo, aiSummary } = req.body;
  
  if (!auditData || !leadInfo || !leadInfo.email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const publicId = nanoid(10);

  try {
    const audit = await createAudit({
      publicId,
      toolsData: auditData.tools,
      savingsData: auditData.savings,
      aiSummary,
      ...leadInfo
    });

    // Send transactional email
    await sendAuditConfirmation(
      leadInfo.email, 
      publicId, 
      auditData.savings.totalAnnualSavings
    );

    res.json({ publicId, success: true });
  } catch (error) {
    console.error("Lead Capture Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
