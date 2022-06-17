module.exports = (app) => {
  app.use("/api/users", require("./userRouter"));
};
