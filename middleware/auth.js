import { isTokenValid } from "../utils/index.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    res.status(401).send({ msg: "Authentication Invalid" });
  }

  try {
    const { userId, name, role } = isTokenValid({ token });
    req.user = { userId, name, role };
    next();
  } catch (error) {}
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(402).send({ msg: "Unauthorized to access to this route " });
    }
    next();
  };
};
