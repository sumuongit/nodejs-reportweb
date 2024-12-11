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
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            host: process.env.SMTP_HOST,
            subject: `Query: from ${emailObj.name}`,
            html: `
                <div>
                    Name:
                    <strong>${emailObj.name}</strong>
                </div>
                 <div>
                    Designation:
                    <strong>${emailObj.designation}</strong>
                </div>
                <div>
                    email:
                    <strong> ${emailObj.email}</strong>
                </div>
                <div>
                    Phone Number:
                    <strong> ${emailObj.phoneNumber}</strong>
                </div>
                <div>
                    Message:
                    <p>${emailObj.message}</p>
                </div>
                 <div>
                    Company Name:
                    <p>${emailObj.companyName}</p>
                </div>
                 <div>
                    Industry Name:
                    <p>${emailObj.industryName}</p>
                </div>
            `,
        };
        return await transporter.sendMail(mailOptions);
    } catch (err) {
        return { error: err };
    }
};
