const router = require("express").Router();

const aaa = require("./aaa");
const bbb = require("./bbb");
const ccc = require("./ccc");

router.use("/aaa", aaa);
router.use("/bbb", bbb);
router.use("/ccc", ccc);

module.exports = router;
