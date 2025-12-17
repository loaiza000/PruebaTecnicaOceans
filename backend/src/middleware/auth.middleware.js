import jwt from "jsonwebtoken";
import { response } from "../helpers/response.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return response(res, 401, false, "", "token no proporcionado");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response(res, 401, false, "", "token expirado");
    }
    return response(res, 401, false, "", "token invalido");
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return response(
      res,
      403,
      false,
      "",
      "acceso denegado, se requiere rol de administrador"
    );
  }
  next();
};
