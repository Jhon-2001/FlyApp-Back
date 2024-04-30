import express from 'express';
import prisma from "../../../prisma/prisma-client.js";
// import { User } from "../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const reqBody = await req.body;
    const { email, password } = reqBody;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "email incorrect" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "parola incorrecta" });
    }

    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET || '', {
      expiresIn: "1d",
    });
    return res.status(200).json({ token: token, user: user });
  } catch (error) {
    return res.status(500).json(error.message || error || "Eroare pe server");
  }
});

authRouter.get("/me", async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader != "undefined") {
      // Split the header to get the token part
      const bearer = bearerHeader?.split(" ");
      const token = bearer[1];

      // Verify token
      const tokenInfo = jwt.verify(
        token,
        process.env.TOKEN_SECRET || '',
        async (err, decoded) => {
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
  } catch (error) {
    return res.status(500).json(error.message || error || "Eroare pe server.");
  }
});

authRouter.post("/register", async (req, res) => {
  const { password, email } = req.body;

  try {
    const emailCheck = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (emailCheck) {
      return res.json({ error: "Email already exists" });
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      return res.status(200).json(user);
    }
    
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
