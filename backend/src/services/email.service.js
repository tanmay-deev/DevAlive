class EmailService {
  async sendEmail(to, subject, text, html) {
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      console.warn('[Email] Missing BREVO_API_KEY or BREVO_SENDER_EMAIL in .env. Email not sent.');
      return;
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME || 'DevAlive Alerts',
            email: process.env.BREVO_SENDER_EMAIL
          },
          to: [
            {
              email: to
            }
          ],
          subject: subject,
          htmlContent: html || text,
          textContent: text
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Email] Brevo API Error:', errorData);
        throw new Error(`Brevo API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Email] Message sent successfully via Brevo. MessageId:', data.messageId);
      return data;
    } catch (error) {
      console.error('[Email] Error sending email via Brevo:', error);
      throw error; 
    }
  }

  async sendDowntimeAlert(userEmail, projectName, projectUrl, time) {
    const subject = `Status Update: ${projectName} is currently unreachable`;
    
    const text = `Status Notification: Your project "${projectName}" (${projectUrl}) is reported offline as of ${time}. We are monitoring the situation and will notify you when connectivity is restored.`;

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
    const subject = `Status Resolved: ${projectName} connection restored`;
    
    const text = `Status Notification: Your project "${projectName}" (${projectUrl}) has successfully recovered and is back online as of ${time}.`;

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

  async sendPasswordResetEmail(userEmail, resetUrl) {
    const subject = `Password Reset Request - DevAlive`;
    
    const text = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #096dd9; padding-bottom: 10px;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555555; line-height: 1.5;">
          We received a request to reset your DevAlive password. Click the button below to choose a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #096dd9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #777777;">
          If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999999; text-align: center;">
          Sent automatically by DevAlive Security.<br/>
          This link will expire in 10 minutes.
        </p>
      </div>
    `;

    await this.sendEmail(userEmail, subject, text, html);
  }

  async sendVerificationEmail(userEmail, verifyUrl) {
    const subject = `Verify Your Email Address - DevAlive`;
    
    const text = `Welcome to DevAlive! Please verify your email address by clicking the following link: \n\n ${verifyUrl}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #096dd9; padding-bottom: 10px;">Welcome to DevAlive!</h2>
        <p style="font-size: 16px; color: #555555; line-height: 1.5;">
          Thank you for signing up. Please verify your email address to activate your account and start monitoring your projects.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #096dd9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #777777;">
          If you did not create an account with DevAlive, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999999; text-align: center;">
          Sent automatically by DevAlive Security.<br/>
        </p>
      </div>
    `;

    await this.sendEmail(userEmail, subject, text, html);
  }

}

export default new EmailService();
