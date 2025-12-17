import { supabase } from "../database.js";
import { response } from "../helpers/response.js";
import { handleError } from "../helpers/handle.error.js";

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return response(
        res,
        400,
        false,
        "",
        "debe seleccionar al menos un producto"
      );
    }

    const productosConDetalles = [];
    let total = 0;

    for (const item of productos) {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.id)
        .single();

      if (error || !product) {
        return response(
          res,
          404,
          false,
          "",
          `producto con id ${item.id} no encontrado`
        );
      }

      const cantidad = item.cantidad || 1;
      productosConDetalles.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad,
      });
      total += product.precio * cantidad;
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          productos: productosConDetalles,
          total,
        },
      ])
      .select();

    if (error) throw error;

    return response(res, 201, true, data[0], "orden creada exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

orderController.getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return response(res, 200, true, data, "ordenes obtenidas exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

orderController.getByIdOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return response(res, 404, false, "", "orden no encontrada");
    }

    return response(res, 200, true, data, "orden obtenida exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return response(
        res,
        400,
        false,
        "",
        "debe seleccionar al menos un producto"
      );
    }

    const productosConDetalles = [];
    let total = 0;

    for (const item of productos) {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.id)
        .single();

      if (error || !product) {
        return response(
          res,
          404,
          false,
          "",
          `producto con id ${item.id} no encontrado`
        );
      }

      const cantidad = item.cantidad || 1;
      productosConDetalles.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad,
      });
      total += product.precio * cantidad;
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        productos: productosConDetalles,
        total,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return response(res, 404, false, "", "orden no encontrada");
    }

    return response(
      res,
      200,
      true,
      data[0],
      "orden actualizada exitosamente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

orderController.searchOrder = async (req, res) => {
  try {
    const {
      totalMin,
      totalMax,
      fechaInicio,
      fechaFin,
      productoNombre,
      ordenar = "created_at",
      direccion = "desc",
    } = req.query;

    let query = supabase.from("orders").select("*");

    if (totalMin) {
      query = query.gte("total", parseFloat(totalMin));
    }

    if (totalMax) {
      query = query.lte("total", parseFloat(totalMax));
    }

    if (fechaInicio) {
      query = query.gte("created_at", fechaInicio);
    }

    if (fechaFin) {
      query = query.lte("created_at", fechaFin);
    }

    const validOrderFields = ["total", "created_at"];
    const orderField = validOrderFields.includes(ordenar)
      ? ordenar
      : "created_at";
    const ascending = direccion === "asc";

    query = query.order(orderField, { ascending });

    const { data, error } = await query;

    if (error) throw error;

    let filteredData = data;
    if (productoNombre) {
      filteredData = data.filter((order) =>
        order.productos.some((p) =>
          p.nombre.toLowerCase().includes(productoNombre.toLowerCase())
        )
      );
    }

    return response(
      res,
      200,
      true,
      filteredData,
      `${filteredData.length} orden(es) encontrada(s)`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default orderController;
