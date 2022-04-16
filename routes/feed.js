const router = require("express").Router();
const feedController = require("../controller/feed");

// router.get("/", feedController);
router.post("/", feedController.applyPost);
router.post("/:feedId/likes", feedController.likePost);
// router.patch("/", feedController);
router.delete("/:feedId", feedController.deletePost);

module.exports = router;
