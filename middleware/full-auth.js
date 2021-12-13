import { isTokenValid } from "../utils/index.js";

export const authenticateUser = async (req, res, next) => {
  let token;
  //check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  //check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).send({ msg: "Authentication Invalid" });
  }

  try {
    const payload = isTokenValid(token);

    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };
    next();
  } catch (error) {
    res.status(402).send({ msg: "Authentication Invalid" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(402).send({ msg: "Unauthorized to access to this route " });
    }
    next();
  };
};
