import { supabase } from "../database.js";
import { response } from "../helpers/response.js";
import { handleError } from "../helpers/handle.error.js";

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const { nombre, precio } = req.body;

    if (!nombre || nombre.trim() === "") {
      return response(res, 400, false, "", "nombre es requerido");
    }

    if (!precio || precio <= 0) {
      return response(res, 400, false, "", "precio debe ser mayor a cero");
    }
 
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          nombre: nombre.trim(),
          precio: parseFloat(precio),
        },
      ])
      .select();

    if (error) throw error;

    return response(res, 201, true, data[0], "producto creado exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

productController.getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return response(res, 200, true, data, "productos obtenidos exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

productController.getByIdProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return response(res, 404, false, "", "producto no encontrado");
    }

    return response(res, 200, true, data, "producto obtenido exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;

    if (nombre && nombre.trim() === "") {
      return response(res, 400, false, "", "nombre no puede estar vacio");
    }

    if (precio !== undefined && precio <= 0) {
      return response(res, 400, false, "", "precio debe ser mayor a cero");
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre.trim();
    if (precio !== undefined) updateData.precio = parseFloat(precio);

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return response(res, 404, false, "", "producto no encontrado");
    }

    return response(
      res,
      200,
      true,
      data[0],
      "producto actualizado exitosamente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

productController.searchProduct = async (req, res) => {
  try {
    const {
      nombre,
      precioMin,
      precioMax,
      ordenar = "created_at",
      direccion = "desc",
    } = req.query;

    let query = supabase.from("products").select("*");

    if (nombre) {
      query = query.ilike("nombre", `%${nombre}%`);
    }

    if (precioMin) {
      query = query.gte("precio", parseFloat(precioMin));
    }

    if (precioMax) {
      query = query.lte("precio", parseFloat(precioMax));
    }

    const validOrderFields = ["nombre", "precio", "created_at"];
    const orderField = validOrderFields.includes(ordenar)
      ? ordenar
      : "created_at";
    const ascending = direccion === "asc";

    query = query.order(orderField, { ascending });

    const { data, error } = await query;

    if (error) throw error;

    return response(
      res,
      200,
      true,
      data,
      `${data.length} producto(s) encontrado(s)`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default productController;
