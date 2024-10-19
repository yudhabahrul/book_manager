import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const url = `http://localhost:3000/api/users/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking this link: <a href="${url}">${url}</a></p>`,
  });
};
