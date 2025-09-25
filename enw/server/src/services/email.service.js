// Email service stub — replace with real SMTP later
const sendEmail = async ({ to, subject, text, html }) => {
  console.log("[EmailStub] Would send email:", { to, subject });
  return { success: true };
};

export default { sendEmail };
