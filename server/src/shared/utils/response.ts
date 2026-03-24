import { Response } from "express";

export const ok = (res: Response, data: unknown, message = "OK") =>
  res.status(200).json({ success: true, message, data });

export const created = (
  res: Response,
  data: unknown,
  message = "Creado correctamente",
) => res.status(201).json({ success: true, message, data });

export const badRequest = (res: Response, message = "Datos inválidos") =>
  res.status(400).json({ success: false, message });

export const notFound = (res: Response, message = "No encontrado") =>
  res.status(404).json({ success: false, message });

export const unauthorized = (res: Response, message = "No autorizado") =>
  res.status(401).json({ success: false, message });

export const forbidden = (res: Response, message = "Acceso denegado") =>
  res.status(403).json({ success: false, message });

export const serverError = (res: Response, error?: unknown) => {
  return res
    .status(500)
    .json({ success: false, message: "Error interno del servidor" });
};
