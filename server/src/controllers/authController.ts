import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "El email ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: "Admin registrado", id: newAdmin.id });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin no encontrado" });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    const token = generateToken({ id: admin.id, email: admin.email });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
