const router = require("express").Router();
const feedController = require("../controller/feed");
//feed
router.get("/", feedController.showFeed);
router.post("/", feedController.upload.single("image"), feedController.applyFeed);
router.patch("/:feed_Id", feedController.upload.single("image"), feedController.updateFeed);
router.delete("/:feed_Id", feedController.deletFeed);
//feedLike
router.post("/:feed_Id/likes", feedController.likeFeed);
router.delete("/:feed_Id/unlikes", feedController.unlikeFeed);

module.exports = router;
