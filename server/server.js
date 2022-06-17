require("dotenv").config();
const http = require("http");
const con = require("./src/config/database");
const app = require("./src");

const server = http.createServer(app);

const port = process.env.PORT | 5000;

con.connect((error) => {
  if (error) throw error;
  server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
});
