const router = require("express").Router();
const cccController = require("../controller/bbb");

router.get("/", cccController);
router.post("/", cccController);
router.patch("/", cccController);
router.delete("/", cccController);

module.exports = router;
