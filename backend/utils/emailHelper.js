import nodemailer from 'nodemailer';

/**
 * Send email utility
 */
export const sendEmail = async (options) => {
  // Check if SMTP is configured
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.warn('\x1b[33m[Mailer] SMTP configurations are missing. Email send skipped.\x1b[0m');
    console.log(`\x1b[36m[Email Mock Log] To: ${options.email}\nSubject: ${options.subject}\nBody: ${options.message}\x1b[0m`);
    return { mock: true, message: 'SMTP settings missing, email logged to console.' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'GoalFlow'}" <${process.env.FROM_EMAIL || 'noreply@goalflow.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`\x1b[32m[Mailer] Email sent: %s\x1b[0m`, info.messageId);
  return info;
};

/**
 * Generate standard welcome verification HTML template
 */
export const getWelcomeEmailTemplate = (name, verificationUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5; text-align: center;">Welcome to GoalFlow!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for signing up for GoalFlow - the Smart Daily Goal & Habit Tracker. We are thrilled to have you with us!</p>
      <p>Please click the button below to verify your email address and get started tracking your productivity:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" target="_blank" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #888888;">${verificationUrl}</p>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888888; text-align: center;">If you did not request this verification, please ignore this email.</p>
    </div>
  `;
};

/**
 * Generate standard password reset email template
 */
export const getPasswordResetEmailTemplate = (name, resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5; text-align: center;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You are receiving this email because you (or someone else) requested a password reset for your GoalFlow account.</p>
      <p>Please click the button below to reset your password. This link is valid for 10 minutes:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" target="_blank" style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #888888;">${resetUrl}</p>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888888; text-align: center;">GoalFlow Security Team</p>
    </div>
  `;
};

/**
 * Generate standard reminder notification template
 */
export const getReminderEmailTemplate = (name, reminderTitle, details) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5; text-align: center;">GoalFlow Reminder!</h2>
      <p>Hi ${name},</p>
      <p>This is a friendly reminder from your GoalFlow assistant to help you stay on track today.</p>
      <div style="background-color: #F3F4F6; padding: 15px; border-left: 4px solid #4F46E5; border-radius: 4px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #111827;">${reminderTitle}</h4>
        <p style="margin: 0; color: #4B5563; font-size: 14px;">${details || 'Time to complete your scheduled activity.'}</p>
      </div>
      <p>Visit your dashboard to view your progress, complete tasks, and build your streaks.</p>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888888; text-align: center;">You can configure reminder settings in your Profile Settings.</p>
    </div>
  `;
};
