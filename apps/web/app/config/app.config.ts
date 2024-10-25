import { getRequiredServerEnvVar } from "./env.utils";

export const sessionSecret = getRequiredServerEnvVar('SESSION_SECRET', 'SECRET_KEY');
export const authAPIUrl = getRequiredServerEnvVar('AUTH_API_URL');
export const orderAPIUrl = getRequiredServerEnvVar('ORDER_API_URL');
