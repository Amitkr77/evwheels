import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
    text,
}) {
    try {
        const info = await transporter.sendMail({
            from: `"Your Store" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        return info;
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send email");
    }
}