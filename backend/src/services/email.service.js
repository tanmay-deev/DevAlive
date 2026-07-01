import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Instantiate the transporter ONCE when the service initializes
    // This allows Nodemailer to reuse the underlying TCP socket connections
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // FIX 1: Explicitly convert port to Number
      secure: process.env.SMTP_PORT === '465', // True if 465, false otherwise
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Optional: Auto-verify connection health on server startup
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('[Email] SMTP Connection verified and ready.');
    } catch (error) {
      console.error('[Email] SMTP Connection verification failed:', error);
    }
  }

  async sendEmail(to, subject, text, html) {
    try {
      // FIX 2: Reusing the single instantiated connection pool
      const info = await this.transporter.sendMail({
        from: `"DevAlive Alerts" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: html || text,
      });
      
      console.log('[Email] Message sent: %s', info.messageId);

      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        console.log('[Email] Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return info;
    } catch (error) {
      console.error('[Email] Error sending email:', error);
      throw error; // Rethrow so your alert scheduler knows it failed
    }
  }

  async sendDowntimeAlert(userEmail, projectName, projectUrl, time) {
    // Spam-safe, neutral subject line
    const subject = `Status Update: ${projectName} is currently unreachable`;
    
    // Fallback text if user has HTML disabled
    const text = `Status Notification: Your project "${projectName}" (${projectUrl}) is reported offline as of ${time}. We are monitoring the situation and will notify you when connectivity is restored.`;

    // Semantic, clean HTML structure
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #ff4d4f; padding-bottom: 10px;">DevAlive System Alert</h2>
        <p style="font-size: 16px; color: #555555; line-height: 1.5;">
          This is an automated status update regarding your monitored application.
        </p>
        <div style="background-color: #fff1f0; border: 1px solid #ffa39e; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; width: 120px; color: #333;">Project:</td>
              <td style="color: #d9363e; font-weight: bold;">${projectName}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333; padding-top: 8px;">URL:</td>
              <td style="padding-top: 8px;"><a href="${projectUrl}" style="color: #096dd9; text-decoration: none;">${projectUrl}</a></td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333; padding-top: 8px;">Logged At:</td>
              <td style="color: #555555; padding-top: 8px;">${time}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333; padding-top: 8px;">Status:</td>
              <td style="color: #d9363e; font-weight: bold; padding-top: 8px;">Unreachable</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 14px; color: #777777;">
          Our background tasks are continuously monitoring this instance. You will receive an automated follow-up notification as soon as the service recovers.
        </p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999999; text-align: center;">
          Sent automatically by DevAlive Monitoring Service.<br/>
          Please do not reply directly to this operational email.
        </p>
      </div>
    `;

    await this.sendEmail(userEmail, subject, text, html);
  }

  async sendRecoveryAlert(userEmail, projectName, projectUrl, time) {
    // Spam-safe, neutral subject line
    const subject = `Status Resolved: ${projectName} connection restored`;
    
    // Fallback text if user has HTML disabled
    const text = `Status Notification: Your project "${projectName}" (${projectUrl}) has successfully recovered and is back online as of ${time}.`;

    // Semantic, clean HTML structure
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #52c41a; padding-bottom: 10px;">DevAlive System Resolved</h2>
        <p style="font-size: 16px; color: #555555; line-height: 1.5;">
          Good news! Your monitored application has cleared its downtime state.
        </p>
        <div style="background-color: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; width: 120px; color: #333;">Project:</td>
              <td style="color: #389e0d; font-weight: bold;">${projectName}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333; padding-top: 8px;">URL:</td>
              <td style="padding-top: 8px;"><a href="${projectUrl}" style="color: #096dd9; text-decoration: none;">${projectUrl}</a></td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333; padding-top: 8px;">Recovered At:</td>
              <td style="color: #555555; padding-top: 8px;">${time}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333; padding-top: 8px;">Status:</td>
              <td style="color: #389e0d; font-weight: bold; padding-top: 8px;">Operational (200 OK)</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 14px; color: #777777;">
          The service is responding within normal parameters. Active logging and monitoring processes have resumed their standard cycle.
        </p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999999; text-align: center;">
          Sent automatically by DevAlive Monitoring Service.<br/>
          Please do not reply directly to this operational email.
        </p>
      </div>
    `;

    await this.sendEmail(userEmail, subject, text, html);
  }

}

export default new EmailService();
