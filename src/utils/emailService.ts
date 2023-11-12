import nodemailer from 'nodemailer'
import EmailOptions from '@customizesTypes/EmailOptions'

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});

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
`
};

const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: options.to,
        subject: options.subject,
        html: options.html
    }

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false
    }
}

export {
    emailTemplates,
    sendEmail
}