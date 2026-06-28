import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ForgetPassword = () => {
  const navigate = useNavigate();

  // Steps: "email" -> "otp" -> "reset"
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  // Password reset fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    try {
      await axios.post("http://localhost:8080/forgot-password", {
        email,
      });

      setStep("otp");
      setOtp(new Array(6).fill(""));
      toast.success("OTP sent to your email");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Handle OTP input change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      await axios.post("http://localhost:8080/verify-otp", {
        email,
        otp: finalOtp,
      });

      toast.success("OTP verified successfully!");
      setStep("reset");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    await sendOtp();
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8080/reset-password", {
        email,
        newPassword,
      });

      toast.success("Password updated successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  // --- Render helpers for each step ---

  const renderEmailStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600">
          Enter your email to receive a verification code
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendOtp()}
          />
        </div>

        <button
          onClick={sendOtp}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
        >
          Send OTP
        </button>
      </div>
    </>
  );

  const renderOtpStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Verify OTP
        </h1>
        <p className="text-gray-600">
          Enter the 6-digit code sent to <span className="font-medium text-gray-800">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-3 mb-2">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          ))}
        </div>

        <button
          onClick={verifyOtp}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
        >
          Verify OTP
        </button>

        <button
          onClick={resendOtp}
          className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2 transition"
        >
          Didn't receive the code? Resend OTP
        </button>
      </div>
    </>
  );

  const renderResetStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Set New Password
        </h1>
        <p className="text-gray-600">
          Create a new password for your account
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        {/* New Password Field */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle new password visibility"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Update Password Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
        >
          Update Password
        </button>
      </form>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Image (same as Login page) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800">
        <img
          src="/src/assets/GenAi.jpg"
          alt="GenAi"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form (same layout as Login page) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-md">
          {/* Step Content */}
          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOtpStep()}
          {step === "reset" && renderResetStep()}

          {/* Back to Login Link (same style as Login page) */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;