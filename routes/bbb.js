const router = require("express").Router();
const bbbController = require("../controller/bbb");

router.get("/", bbbController);
router.post("/", bbbController);
router.patch("/", bbbController);
router.delete("/", bbbController);

module.exports = router;
