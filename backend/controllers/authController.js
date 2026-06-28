import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * POST /signup
 */
export const signup = async (req, res) => {
  try {
    const { name, fullName, email, password } = req.body;
    const finalFullName = fullName || name;

    if (!finalFullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate userId without crypto
    const userId =
      "USR" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    const user = await User.create({
      userId,
      fullName: finalFullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * POST /login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    // 5. Send response (no token in body)
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /verify
 */
export const verify = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      email: decode.email,
      fullName: decode.fullName
    });
  } catch (err) {
    res.status(401).json({ message: "Token expired" });
  }
};

/**
 * POST /logout
 */
export const logout = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(402).json({ message: "Not Found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/"
    });

    res.status(200).json({ message: "Logged Out" });
  } catch (err) {
    return res.status(401).json({ message: "Internal Server Error" });
  }
};
