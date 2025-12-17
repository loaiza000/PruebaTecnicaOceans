import { response } from "./response.js";

export const handleError = async (res, error) => {
  return response(res, 500, false, "", error.message);
};
