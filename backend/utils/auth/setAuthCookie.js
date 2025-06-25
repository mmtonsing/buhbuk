import { signUserToken } from "./signUserToken.js";
import { cookieSettings } from "./cookieOptions.js";

export function setAuthCookie(res, user) {
  const token = signUserToken(user);
  res.cookie("token", token, cookieSettings);
}
