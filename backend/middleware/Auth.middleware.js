import { verifyToken } from "../Functions/token.function.js";
import prisma from "../Database/prismaClient.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }
    const verifyTok = verifyToken(token);
    if (!verifyTok) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    let result = await prisma.user.findUnique({
      where: { id: verifyTok },
    });
    if (!result) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    let data = {
      id: verifyTok,
      _id: String(verifyTok),
      username: result.username,
      email: result.email,
      type: result.type,
      createdAt: result.createdAt,
    };
    req.userData = data;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized Access",
      error: error.message,
    });
  }
};

export { authMiddleware };
