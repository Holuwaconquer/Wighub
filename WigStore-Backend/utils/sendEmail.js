const { Resend } = require('resend');

const resend = new Resend('re_WNBkHoRi_CJbArsqkrS2DDMgBZPLJ91yW');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const code = error?.cause?.code || error?.code || '';
  const message = String(error?.message || '').toLowerCase();
  return (
    code === 'UND_ERR_CONNECT_TIMEOUT' ||
    code === 'UND_ERR_SOCKET_TIMEOUT' ||
    message.includes('fetch failed') ||
    message.includes('connect timeout') ||
    message.includes('network error')
  );
};

const sendEmail = async (options) => {
  const rawFrom = process.env.EMAIL_FROM || 'Minka Luxury Hair <noreply@minkaluxury.com>';
  const cleanedFrom = rawFrom.replace(/['"]/g, '').trim();
  const from = cleanedFrom.includes('<')
    ? cleanedFrom
    : `Minka Luxury Hair <${cleanedFrom}>`;

  const maxRetries = Number(process.env.EMAIL_RETRY_COUNT || 2);
  const baseDelay = Number(process.env.EMAIL_RETRY_DELAY_MS || 1500);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      console.debug('Resend sendEmail:', { from, to: options.email, subject: options.subject, attempt });

      const response = await resend.emails.send({
        from,
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
      const retryable = isRetryableError(error) && attempt < maxRetries;
      console.error('SendEmail error:', error, { attempt, retryable });

      if (retryable) {
        const delay = baseDelay * (2 ** attempt);
        console.warn(`Retrying email send in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }
};

module.exports = sendEmail;