// src/config/nodeMailer.ts
import nodemailer from 'nodemailer';
import { vars } from './vars';
import AppError from '../utils/appError';

const { emailHost, emailPort, emailUsername, emailPassword } = vars;

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

// reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailPort === 465, // true for 465, false for other ports
  auth: {
    user: emailUsername,
    pass: emailPassword,
  },
});

/**
 * Sends an email with the provided options.
 * @param {EmailOptions} options - The email options including recipient, subject, message, and optionally HTML content.
 * @returns {Promise<void>} - A promise that resolves if the email is sent successfully, or rejects with an error otherwise.
 */
const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: 'memorytospace@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to send email to ${options.email}:`, errorMessage);
    throw new AppError(`Failed to send email to ${options.email}: ${errorMessage}`, 500);
  }
};

export default sendEmail;
