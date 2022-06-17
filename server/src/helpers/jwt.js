const jwt = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRECT, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRED_TIME,
    });
  },
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRECT, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRED_TIME,
    });
  },
  verifyToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
  verifyRefreshToken: (refreshToken) => {
    let data = {};
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRECT,
      (err, result) => {
        if (err) {
          data.error = true;
        } else {
          const tokenData = { id: result.id, name: result.name };
          data.error = false;
          data.result = tokenData;
        }
      }
    );
    return data;
  },
};
