// lib/mailer.js - Nodemailer lazy singleton for WebForge v11.1
// Never crashes when unconfigured; returns {sent:false, reason:'not-configured'} gracefully.

import nodemailer from 'nodemailer';
import { FORMS } from '@/config/site';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL for 465, TLS/STARTTLS for 587
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendMail(opts) {
  const { to, subject, html, text, replyTo, attachments } = opts;
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    console.warn('[mailer] SMTP not configured. Skipping email send without crashing.');
    return { sent: false, reason: 'not-configured' };
  }

  const from = process.env.SMTP_FROM || FORMS.smtpFrom || process.env.SMTP_USER;

  try {
    const info = await mailTransporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || '',
      replyTo: replyTo || from,
      ...(attachments && attachments.length ? { attachments } : {}),
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[mailer] Error sending mail:', err);
    return { sent: false, reason: err.message || 'send-failed' };
  }
}
