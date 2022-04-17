const SequelizeAuto = require("sequelize-auto");
const auto = new SequelizeAuto("instagram", "youngwoo", "youngwoosql1234!", {
  host: "13.125.106.153",
  port: "3306",
  dialect: "mysql",
  //noAlias: true // as 별칭 미설정 여부
});
auto.run((err) => {
  if (err) throw err;
});
