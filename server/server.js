require('dotenv').config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { nanoid } = require("nanoid");
const { generateSummary } = require("./services/aiService");
const { createAudit, getAuditByPublicId } = require("./services/dbService");
const { sendAuditConfirmation } = require("./services/emailService");

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Generate AI summary before lead capture
app.post("/api/audit/summary", async (req, res) => {
  const { auditData } = req.body;
  if (!auditData) return res.status(400).json({ error: "Missing audit data" });
  
  const summary = await generateSummary(auditData);
  res.json({ summary });
});

// Final save after email capture
app.post("/api/audit/save", async (req, res) => {
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
    console.error("Save Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get shareable result (PII stripped in dbService)
app.get("/api/audit/:id", async (req, res) => {
  try {
    const audit = await getAuditByPublicId(req.params.id);
    if (!audit) return res.status(404).json({ error: "Audit not found" });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
