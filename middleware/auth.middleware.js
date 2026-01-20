import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "no token provided",
      });
    }

    // decode

    const decodeUser = jwt.verify(token, process.env.JWT_TOKEN);

    // attach user

    req.user = decodeUser;
    next()
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "something went wrong",
      message: error.message,
    });
  }
};
