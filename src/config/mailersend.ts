// src/config/mailersend.ts
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { vars } from './vars';
const mailerSend = new MailerSend({
  apiKey: vars.mailesendApiKey,
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const emailParams = new EmailParams()
    .setFrom(new Sender(vars.fromEmail, vars.fromName))
    .setTo([new Recipient(options.to)])
    .setSubject(options.subject)
    .setText(options.text)
    .setHtml(options.html);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
