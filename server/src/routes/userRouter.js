const router = require("express").Router();
const pwdHash = require("password-hash");
const { body, param, validationResult } = require("express-validator");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
} = require("../helpers/jwt");
const con = require("../config/database");

router.get("/", (req, res) => {
  res.send("user get router");
});

router.get("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const qry = "SELECT id,name,email,status FROM users WHERE id=?";
  con.query(qry, [id], (err, result) => {
    if (err) throw err;
    if (!result.length)
      return res.send({
        error: false,
        success: true,
        data: {},
      });
    res.send({
      error: false,
      success: true,
      data: result[0],
    });
  });
});

router.post(
  "/refreshToken",
  body("refreshToken").exists().withMessage("Token is empty"),
  (req, res) => {
    const { refreshToken } = req.body;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, errors: errors.array() });
    }

    if (req.session.refreshToken !== refreshToken) return res.sendStatus(403);

    const result = verifyRefreshToken(refreshToken);
    if (result.error) return res.sendStatus(401);

    const finalResult = {
      token: generateAccessToken(result.result),
      refreshToken: generateRefreshToken(result.result),
    };

    req.session.refreshToken = finalResult.refreshToken;
    res.send(finalResult);
  }
);

router.post(
  "/", // username must be an email
  body("email").isEmail().withMessage("email is not valid"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long"),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const qry =
      "INSERT INTO `users`(`name`, `email`, `password`, `status`) VALUES (?,?,?,?)";
    con.query(
      qry,
      [name, email, pwdHash.generate(password), "active"],
      (err, result) => {
        if (err) throw err;
        if (result.affectedRows) {
          res.send({
            error: false,
            success: true,
          });
        } else {
          res.send({
            error: true,
            success: false,
          });
        }
      }
    );
  }
);

router.post(
  "/login",
  body("email").isEmail().withMessage("email is not valid"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long"),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, errors: errors.array() });
    }

    const { email, password } = req.body;
    const qry = "SELECT * FROM users WHERE email=?";
    con.query(qry, [email], (err, result) => {
      if (err) throw err;
      const user = result[0];
      const verifyPassword = pwdHash.verify(password, user.password);
      if (!verifyPassword)
        return res.send({
          error: true,
          success: false,
          errorMsg: "Password do not matched...",
        });

      const payload = {
        id: result[0].id,
        name: result[0].name,
      };

      const token = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      req.session.refreshToken = refreshToken;

      res.send({
        error: false,
        success: true,
        data: {
          token,
          refreshToken,
        },
      });
    });
  }
);

module.exports = router;
