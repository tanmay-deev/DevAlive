import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      // secure: true for 465, false for other ports (like 587)
      secure: process.env.SMTP_PORT === '465' ? true : false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, text, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `"DevAlive Alerts" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: html || text,
      });
      console.log('[Email] Message sent: %s', info.messageId);
      // If using ethereal email for testing, log the preview URL
      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        console.log('[Email] Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return info;
    } catch (error) {
      console.error('[Email] Error sending email:', error);
    }
  }

  async sendDowntimeAlert(userEmail, projectName, projectUrl, time) {
    const subject = `🚨 URGENT: ${projectName} is DOWN`;
    const text = `Hello,\n\nYour project "${projectName}" (${projectUrl}) went offline at ${time}.\n\nWe will notify you when it recovers.\n\nThanks,\nDevAlive Team`;
    await this.sendEmail(userEmail, subject, text);
  }

  async sendRecoveryAlert(userEmail, projectName, projectUrl, time) {
    const subject = `✅ RECOVERED: ${projectName} is BACK ONLINE`;
    const text = `Hello,\n\nGood news! Your project "${projectName}" (${projectUrl}) recovered and is back online as of ${time}.\n\nThanks,\nDevAlive Team`;
    await this.sendEmail(userEmail, subject, text);
  }
}

export default new EmailService();
