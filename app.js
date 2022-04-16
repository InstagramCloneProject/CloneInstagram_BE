require("dotenv").config();
const express = require("express");
const app = express();
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const Router = require("./routes");

// const sequelize = require("./models").sequelize;
// sequelize.sync();

// app.use(cors());
// app.use(morgan("dev"));

//x-Powerd-By 제거
const removeHeader = (req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
};
// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./swagger-output");

// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(removeHeader);

app.use("/api", Router);
app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
