const app = require("./app");
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message }); //multer 에러 핸들링
});
app.listen(3000, () => {
  console.log(3000, "http://localhost:3000");
});
