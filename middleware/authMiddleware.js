const jwt = require("jsonwebtoken");

const checkUserAuthentication = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid Token!" });
  }
  try {
    const isAuthenticated = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isAuthenticated) {
      return res.status(401).json({
        message:
          "You are not authorized to perform this action.Please login and try again!",
      });
    }
    req._id = isAuthenticated.id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUserAuthentication;
