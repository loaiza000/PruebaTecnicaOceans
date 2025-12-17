import { supabase } from "../database.js";
import { response } from "../helpers/response.js";
import { handleError } from "../helpers/handle.error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authController = {};

const JWT_SECRET = process.env.JWT_SECRET;

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
      return response(res, 400, false, "", "el email es requerido");
    }

    if (!password || password.trim() === "") {
      return response(res, 400, false, "", "la contrasena es requerida");
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return response(res, 401, false, "", "credenciales invalidas");
    }

    if (!user.activo) {
      return response(res, 403, false, "", "usuario inactivo");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response(res, 401, false, "", "credenciales invalidas");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    const userData = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      token,
    };

    return response(res, 200, true, userData, "login exitoso");
  } catch (error) {
    return handleError(res, error);
  }
};

authController.verifyToken = async (req, res) => {
  try {
    const userData = {
      id: req.user.id,
      email: req.user.email,
      nombre: req.user.nombre,
      rol: req.user.rol,
    };

    return response(res, 200, true, userData, "token valido");
  } catch (error) {
    return handleError(res, error);
  }
};

authController.getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, nombre, rol, activo, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return response(res, 404, false, "", "usuario no encontrado");
    }

    return response(res, 200, true, user, "perfil obtenido exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

authController.getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, nombre, rol, activo, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return response(
      res,
      200,
      true,
      users,
      "usuarios obtenidos exitosamente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default authController;
