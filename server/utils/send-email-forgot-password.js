const nodemailer = require("nodemailer");

module.exports = async (emailObj) => {
    try {
        if (!emailObj || !emailObj.email || !emailObj.resetPasswordUrl) {
            throw new Error("Invalid email object. Ensure 'email' and 'resetPasswordUrl' are provided.");
        }

        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("Missing SMTP configuration. Verify environment variables.");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: false, // Set to true if using port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: emailObj.email,
            to: emailObj.email,
            subject: `Password Reset Request`,
            text: `Click the following link to reset your password: ${emailObj.resetPasswordUrl}. This link expires in 1 hour.`,
            html: `
                <p>Click <a href="${emailObj.resetPasswordUrl}">here</a> to reset your password. This link expires in 1 hour.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        //console.log(`Email sent successfully: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error("Failed to send email:", err.message, err.stack);

        return {
            success: false,
            error: err.message,
            details: err,
        };
    }
};