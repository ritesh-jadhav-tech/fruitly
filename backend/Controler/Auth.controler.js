import { hashPassword, compareHash } from "../Functions/crypto.functions.js";
import { generateToken } from "../Functions/token.function.js";
import prisma from "../Database/prismaClient.js";

// Normalize user to a shape the frontend expects:
// - username → name
// - type → role (Vendor → admin, Customer → customer)
function normalizeUser(user) {
  return {
    id: user.id,
    _id: String(user.id),
    name: user.username,
    username: user.username,
    email: user.email,
    role: user.type === "Vendor" ? "admin" : "customer",
    type: user.type,
    createdAt: user.createdAt,
  };
}

function sendAuthResponse(res, status, user) {
  const userData = normalizeUser(user);
  return res.status(status).json({
    user: userData,
    token: generateToken(user.id),
  });
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const userDbResult = await prisma.user.findUnique({ where: { email } });
    if (!userDbResult) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const result = await compareHash(password, userDbResult.password);
    if (!result) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    return sendAuthResponse(res, 200, userDbResult);
  } catch (error) {
    return res.status(500).json({ message: "Server error during login", error: error.message });
  }
}

async function signup(req, res) {
  try {
    const { username, name, email, password, type } = req.body;
    const resolvedName = username || name;
    if (!resolvedName || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const hash = await hashPassword(password);
    const result = await prisma.user.create({
      data: { username: resolvedName, email, password: hash, type: type || "Customer" },
    });
    return sendAuthResponse(res, 201, result);
  } catch (error) {
    return res.status(500).json({ message: "Server error during signup", error: error.message });
  }
}

function logout(req, res) {
  res.status(200).json({ message: "Logged out successfully" });
}

// GET /auth/me — returns current authenticated user
async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userData.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: normalizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PUT /auth/me — update profile (name/username only)
async function updateMe(req, res) {
  try {
    const { name, username } = req.body;
    const resolvedName = name || username;
    if (!resolvedName || resolvedName.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    const updated = await prisma.user.update({
      where: { id: req.userData.id },
      data: { username: resolvedName.trim() },
    });
    return res.status(200).json({ user: normalizeUser(updated) });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PUT /auth/change-password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const user = await prisma.user.findUnique({ where: { id: req.userData.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const match = await compareHash(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const hash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function loginWithGoogle(req, res) {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (user) {
      return res.status(200).json({ message: "USER FOUND", user: normalizeUser(user), token: generateToken(user.id) });
    } else {
      return res.status(200).json({ message: "USER NOT FOUND" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function loginWithGoogle_CreateUser(req, res) {
  try {
    if (!req.body.email || !req.body.username) {
      return res.status(400).json({ message: "Email and name are required" });
    }
    const password = await hashPassword(req.body.fir_pass || Math.random().toString(36));
    const user = await prisma.user.create({
      data: {
        username: req.body.username || req.body.email.split("@")[0],
        email: req.body.email,
        password,
        type: req.body.type || "Customer",
      },
    });
    return res.status(201).json({ message: "User created successfully", user: normalizeUser(user), token: generateToken(user.id) });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { login, signup, logout, getMe, updateMe, changePassword, loginWithGoogle, loginWithGoogle_CreateUser };
