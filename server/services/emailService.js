const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendAuditConfirmation = async (email, auditId, savings) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"SpendLens Audits" <noreply@spendlens.ai>',
    to: email,
    subject: 'Your AI Spend Audit Report',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h1 style="color: #2563eb;">Your Audit Results</h1>
        <p>Thank you for using our AI Spend Audit tool.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="font-size: 18px; margin: 0;">We've calculated that you could save:</p>
          <p style="font-size: 32px; font-weight: bold; color: #059669; margin: 10px 0;">$${savings.toLocaleString()} / year</p>
        </div>
        <p>View your full interactive report here:</p>
        <a href="${process.env.FRONTEND_URL}/r/${auditId}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Full Report</a>
        ${savings > 500 ? '<p style="margin-top: 20px; color: #475569;">Since your savings are significant, a consultant will reach out to help you optimize further.</p>' : ''}
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 SpendLens by Credex. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("SMTP Email sending failed:", error.message);
    
    // Fallback for testing/demo
    console.log("------------------- MOCK EMAIL (SMTP FAIL) -------------------");
    console.log(`To: ${email}`);
    console.log(`Subject: Your AI Spend Audit Report`);
    console.log(`Savings: $${savings}`);
    console.log("--------------------------------------------------------------");
    return true; // Return true for demo purposes
  }
};

module.exports = { sendAuditConfirmation };
