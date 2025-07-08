import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.MP_ACCESS_TOKEN || "";

mercadopago.configurations.setAccessToken(accessToken);

export default mercadopago;
