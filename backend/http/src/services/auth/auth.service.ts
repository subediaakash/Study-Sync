import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserSchema } from "../../zod/userSchema.zod";
import { get } from "http";

const prisma = new PrismaClient();

export class AuthService {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const validation = UserSchema.safeParse({ name, email, password });
      if (!validation.success) {
        res
          .status(400)
          .json({ error: "Invalid user data", details: validation.error });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ error: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET || "your-default-secret",
        { expiresIn: "24h" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({
        message: "User created successfully",
        data: {
          name: user.name,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET || "your-default-secret",
        { expiresIn: "24h" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({
        message: "User signed in successfully",
        data: {
          name: user.name,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getUserProfile(req: Request, res: Response): Promise<void> {
    const id = req.body.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        message: "User profile retrieved successfully",
        data: user,
      });
    } catch (err) {
      console.error("Error retrieving user profile:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
