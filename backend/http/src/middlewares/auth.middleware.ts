import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      res.status(401).json({ error: "Unauthorized, no token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-default-secret"
    ) as { userId: string };

    Promise.resolve(
      prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    )
      .then((user) => {
        if (!user) {
          res.status(401).json({ error: "Unauthorized, user not found" });
          return;
        }

        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Unauthorized, error finding user" });
        return;
      });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized, invalid token" });
    return;
  }
};
