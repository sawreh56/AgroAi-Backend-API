import { config } from "../config/envConfig";
import nodemailer from "nodemailer";
import { apiErrors } from "../utills/error.handler";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL,
    pass: config.PASS_CODE,
  },
});

export const sendOtpViaEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"AgroAI" <${config.EMAIL}>`,
      to: email,
      subject: "OTP Verification",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
  <h2 style="margin: 0 0 10px;">OTP Verification</h2>

  <p style="margin: 0 0 12px;">Hi,</p>

  <p style="margin: 0 0 12px;">
    Your OTP code is:
  </p>

  <p style="margin: 0 0 16px;">
    <span
      style="
        display: inline-block;
        padding: 10px 14px;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 4px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
      "
    >
      ${otp}
    </span>
  </p>

  <p style="margin: 0 0 12px;">
    This code expires in <strong>10</strong> minutes.
  </p>

  <p style="margin: 0; font-size: 12px; color: #6b7280;">
    If you didn’t request this, ignore this email.
  </p>
</div>
`,
    });
  } catch (error: unknown) {
    const { statusCode, body } = apiErrors.handleApiErrors(error);
    throw new Error(JSON.parse(body));
  }
};
