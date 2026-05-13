const express = require('express');
const router = express.Router();
const { nanoid } = require("nanoid");
const { createAudit, updateAuditWithLead } = require("../services/dbService");
const { sendAuditConfirmation } = require("../services/emailService");

// Capture lead and update audit
router.post("/", async (req, res) => {
  const { auditData, leadInfo, aiSummary, publicId: existingPublicId } = req.body;
  
  if (!leadInfo || !leadInfo.email) {
    return res.status(400).json({ error: "Missing email" });
  }

  let publicId = existingPublicId;

  try {
    if (publicId) {
      // Update existing audit
      await updateAuditWithLead(publicId, leadInfo);
    } else if (auditData) {
      // Create new audit if none exists
      publicId = nanoid(10);
      await createAudit({
        publicId,
        toolsData: auditData.toolResults,
        savingsData: {
          totalMonthlySavings: auditData.totalMonthlySavings,
          totalAnnualSavings: auditData.totalAnnualSavings
        },
        aiSummary,
        ...leadInfo
      });
    } else {
      return res.status(400).json({ error: "Missing audit data or ID" });
    }

    // Send transactional email
    const savings = auditData?.totalAnnualSavings || 0;
    await sendAuditConfirmation(leadInfo.email, publicId, savings);

    res.json({ publicId, success: true });
  } catch (error) {
    console.error("Lead Capture Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
