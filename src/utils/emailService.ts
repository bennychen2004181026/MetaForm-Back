import sgMail from '@sendgrid/mail';
import EmailOptions from '@interfaces/EmailOptions';
import logger from '@config/utils/winston';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const emailTemplates = {
    verification: (verificationLink: string): string => `
    <html>
    <body>
      <p>Hi there,</p>
      <p>Just click the button below and start making glorious forms. If you got this email by mistake, ignore it and have a nice day.</p>
      <p>This button expires in 10 minutes. Didn't ask for this email? Just ignore me.</p>
      <a href="${verificationLink}" 
         style="background-color: blue; color: white; padding: 12px 16px; text-align: center; 
                text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; margin-top: 10px;">
        Activate my account
      </a>
    </body>
    </html>
`,
};

const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    const msg = {
        to: options.to,
        from: process.env.EMAIL_USERNAME as string,
        subject: options.subject,
        html: options.html,
    };

    try {
        await sgMail.send(msg);
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

export {
    emailTemplates,
    sendEmail
};