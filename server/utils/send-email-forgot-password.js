const nodemailer = require("nodemailer");

module.exports = async (emailObj) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: emailObj.email,
            to: emailObj.email,
            host: process.env.SMTP_HOST,
            subject: `Password Reset Request`,
            html: `<p>Click <a href="${emailObj.resetPasswordUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`                
        };
        return await transporter.sendMail(mailOptions);
    } catch (err) {
        return { error: err };
    }
};
