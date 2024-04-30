import express from "express";
import type { NextFunction, Request, Response } from "express";
import prisma from "../../../prisma/prisma-client";
import { User } from "../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const authRouter = express.Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const reqBody = await req.body;
    const { email, password } = reqBody;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    console.log(user)
    if (!user) {
      return res.status(400).json({ error: "email incorect" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "parola incorecta" });
    }

    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    return res.status(200).json({ token: token, user: user });
  } catch (error: any) {
    return res.status(500).json(error.message || error || "Eroare pe server");
  }
});
authRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader != "undefined") {
      // Split the header to get the token part
      const bearer = bearerHeader?.split(" ");
      const token = bearer[1];

      // Verify token
      const tokenInfo: any = jwt.verify(
        token,
        process.env.TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "Failed to authenticate token." });
          } else {
          
            const user = await prisma.user.findFirst({
              where: {
                id: decoded.id,
              },
            });

            return res.status(200).json({
              id: user?.id,
              email: user?.email,
              name: user?.name,
              role: user?.role,
            });
          }
        }
      );
    }
  } catch (error: any) {
    return res.status(500).json(error.message || error || "Eroare pe server  .");
  }
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { password, email } = req.body;

  try {
    const emailCheck = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (emailCheck) {
      return res.json({ error: "Email already exist" });
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role:"USER"
        },
      });
      return res.status(200).json(user);
    }
    
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});