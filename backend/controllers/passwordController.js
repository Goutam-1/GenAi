import bcrypt from "bcrypt";
import User from "../models/user.js";
import Otp from "../models/otp.js";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * POST /forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // remove old otp for this email
    await Otp.deleteMany({ email });

    // generate 6 digit otp
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // save latest otp in otp table
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // send otp email
    await sendEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log("Forgot Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * POST /verify-otp
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Verify OTP Request:", email, otp);
    // find otp for email
    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    // check otp match
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // check expiry
    if (new Date() > otpData.expiresAt) {
      await Otp.deleteMany({ email });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // delete otp after successful verification
    await Otp.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.log("Verify OTP Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * POST /reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log("Reset Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
