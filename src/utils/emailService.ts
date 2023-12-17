import sgMail from '@sendgrid/mail';
import EmailOptions from '@interfaces/EmailOptions';

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
    resetPassword: (resetLink: string): string => `
    <html>
    <body>
      <p>Hello,</p>
      <p>You requested to reset your password. Please click the button below to set a new password. If you did not request a password reset, please ignore this email.</p>
      <p>This link expires in 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
      <a href="${resetLink}" 
         style="background-color: blue; color: white; padding: 12px 16px; text-align: center; 
                text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; margin-top: 10px;">
        Reset my password
      </a>
    </body>
    </html>
`,
    employeeVerification: (verificationLink: string, employeeName: string): string => `
    <html>
    <body>
      <p>Hi ${employeeName},</p>
      <p>Welcome to our team! To get started, please verify your email address and set up your account.</p>
      <p>Click the button below to verify your email address. This link expires in 10 minutes.</p>
      <a href="${verificationLink}" 
         style="background-color: blue; color: white; padding: 12px 16px; text-align: center; 
         text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; margin-top: 10px;">
        Verify Email
      </a>
      <p>If you received this email by mistake, please ignore it.</p>
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
        return false;
    }
};

export { emailTemplates, sendEmail };
