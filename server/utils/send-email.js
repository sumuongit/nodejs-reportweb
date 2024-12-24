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
            subject: `Site Point: A1 Polymer Power BI Report`,
            html: `<p>Click <a href="${rocess.env.PRO_ORIGIN}">here</a> to sign in using the credentials provided below.</p>
                <div>
                    Name:
                    <strong>${emailObj.name}</strong>
                </div>                 
                <div>
                    Email Address:
                    <strong> ${emailObj.email}</strong>
                </div>                
                <div>
                    Password:
                    <strong>${emailObj.password}</strong>
                </div>                 
            `,
        };
        return await transporter.sendMail(mailOptions);
    } catch (err) {
        return { error: err };
    }
};
