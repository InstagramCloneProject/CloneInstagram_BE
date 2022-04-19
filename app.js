require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const Router = require("./routes")

const corsOptions = {
  origin: "http://localhost:3000", // 허락하고자 하는 요청 주소
  credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(cors())
// app.use(morgan("dev"));
const removeHeader = (req, res, next) => {
  res.removeHeader("X-Powered-By")
  next()
}
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("./swagger-output")

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(removeHeader)
app.use("/api", Router)

app.get("/", (req, res) => {
  res.send("Hello World")
})

module.exports = app
