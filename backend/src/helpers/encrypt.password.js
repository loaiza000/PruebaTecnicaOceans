import bcrypt from "bcryptjs";

export const encryptPassword = async (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passwordEncrypted = bcrypt.hashSync(password, salt);
    return passwordEncrypted;
  } catch (error) {
    console.log(`error al encriptar password: ${error.message}`);
  }
};
