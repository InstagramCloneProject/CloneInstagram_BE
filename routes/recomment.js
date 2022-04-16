const router = require("express").Router();
const recommentController = require("../controller/recomment");

// router.get("/", cccController);
router.post("/", recommentController.applyRecomment);
// router.patch("/", cccController);
// router.delete("/", cccController);

module.exports = router;
