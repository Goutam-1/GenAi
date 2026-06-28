import { Resend } from "resend";

export const sendEmail = async (email, otp) => {
  try {
    const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "OTP Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
