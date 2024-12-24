const nodemailer = require("nodemailer");

module.exports = async (emailObj) => {
    try {
        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("SMTP configuration is incomplete. Please check your environment variables.");
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
                rejectUnauthorized: false
            },
        });

        if (!emailObj || !emailObj.email || !emailObj.password) {
            throw new Error("Invalid email object provided. Ensure 'email' and 'password' fields are defined.");
        }

        const mailOptions = {
            from: emailObj.email,
            to: emailObj.email,
            subject: `Site Point: A1 Polymer Power BI Report`,
            text: `Click the following link: ${process.env.PRO_ORIGIN}.`,
            html: `
                <p>Click <a href="${process.env.PRO_ORIGIN}">here</a> to sign in using the credentials provided below.</p>
                <div>
                    Email Address:
                    <strong>${emailObj.email}</strong>
                </div>
                <div>
                    Password:
                    <strong>${emailObj.password}</strong>
                </div>`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error("Error sending email:", err.message, err.stack);

        return {
            success: false,
            error: err.message,
            details: err,
        };
    }
};