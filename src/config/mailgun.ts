import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { vars } from './vars';
import AppError from '../utils/appError';

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: vars.mailgunApiKey,
});

interface EmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const msg = await mg.messages.create(vars.mailgunDomain, {
      from: `Excited User <${vars.emailFrom}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(msg);
  } catch (err: any) {
    console.error(err);
    throw new AppError(`Failed to send email: ${err.message}`, 500);
  }
};

export default sendEmail;
