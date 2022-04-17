const router = require("express").Router();
const userController = require("../controller/user");

// router.get("/", bbbController);
router.post("/join", userController.join);
router.post("/:userId/follow", userController.follow)
// router.patch("/", bbbController);
// router.delete("/", bbbController);

module.exports = router;