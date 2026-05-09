const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendAuditConfirmation = async (email, auditId, savings) => {
  try {
    await resend.emails.send({
      from: 'Audits <onboarding@resend.dev>', // Change to your domain in production
      to: email,
      subject: 'Your AI Spend Audit Report',
      html: `
        <h1>Audit Results</h1>
        <p>Thank you for using our AI Spend Audit tool.</p>
        <p>We've calculated that you could save <strong>$${savings}</strong> annually.</p>
        <p>View your full report here: <a href="${process.env.FRONTEND_URL}/r/${auditId}">Full Report</a></p>
        ${savings > 500 ? '<p>Since your savings are significant, a Credex consultant will reach out to help you optimize further.</p>' : ''}
      `,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = { sendAuditConfirmation };
