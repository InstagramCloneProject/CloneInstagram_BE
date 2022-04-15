const router = require("express").Router();
const aaaController = require("../controller/aaa");

router.get("/", aaaController);
router.post("/", aaaController);
router.patch("/", aaaController);
router.delete("/", aaaController);

module.exports = router;
