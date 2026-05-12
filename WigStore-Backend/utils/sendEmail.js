const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const response = await resend.emails.send({
      from: `Minka Luxury Hair <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message,
      replyTo: process.env.ADMIN_EMAIL
    });

    if (response.error) {
      console.error('Resend email error:', response.error);
      throw new Error(`Failed to send email: ${response.error.message}`);
    }

    return response;
  } catch (error) {
    console.error('SendEmail error:', error);
    throw error;
  }
};

module.exports = sendEmail;