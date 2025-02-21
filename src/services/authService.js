// const { User, RefreshToken } = require("../models");
import User from "../models/User";
import RefreshToken from "../models/RefreshToken";
const bcrypt = require("bcryptjs");
const {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../middleware/JWTAction");
// import { BlacklistedToken } from "../models";

const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return {
        success: false,
        statusCode: 409,
        message: "Email already exists",
        data: null,
      };
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);

    // Create new user
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
      id: Date.now(), // Simple way to generate unique id
    });

    return {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
    };
  } catch (error) {
    console.log("Register error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid email or password",
        data: null,
      };
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid email or password",
        data: null,
      };
    }

    // Generate tokens
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = createToken(payload);
    const refreshToken = createRefreshToken(payload);

    // Tính thời gian hết hạn (7 ngày)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Lưu refresh token vào database
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiryDate: expiryDate,
    });

    return {
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

const logoutUser = async (refreshToken) => {
  try {
    console.log("Received refresh token:", refreshToken);

    if (!refreshToken) {
      return {
        success: false,
        statusCode: 400,
        message: "Refresh token is required",
        data: null,
      };
    }

    // Verify refreshToken
    const decoded = verifyRefreshToken(refreshToken);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      return {
        success: false,
        statusCode: 401,
        message: "Invalid or expired refresh token",
        data: null,
      };
    }

    // Tìm và cập nhật token trong RefreshToken collection
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
    });

    if (!tokenDoc) {
      return {
        success: false,
        statusCode: 401,
        message: "Session not found or already logged out",
        data: null,
      };
    }

    // Đánh dấu token đã bị thu hồi
    await RefreshToken.findByIdAndUpdate(tokenDoc._id, {
      isRevoked: true,
    });

    return {
      success: true,
      statusCode: 200,
      message: "Logged out successfully",
      data: null,
    };
  } catch (error) {
    console.log("Logout error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
