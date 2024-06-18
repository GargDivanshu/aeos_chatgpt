// utils/emailQueueProcessor.ts
import Queue from 'bull';
import sgMail from '@sendgrid/mail';

const emailQueue = new Queue('emailQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {},
  },
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

emailQueue.process(async (job, done) => {
  const { to, subject, text } = job.data;

  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    done();
  } catch (error) {
    console.error('Error sending email:', error);
    done(error);
  }
});
