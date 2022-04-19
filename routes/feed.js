const router = require("express").Router();
const feedController = require("../controller/feed");
const authmiddleware = require('../middlewares/auth')
//feed

router.get("/", authmiddleware, feedController.showFeed);
router.post("/", authmiddleware, feedController.upload.single("image"), feedController.applyFeed);
router.patch("/:feed_Id", authmiddleware, feedController.upload.single("image"), feedController.updateFeed);
router.delete("/:feed_Id", authmiddleware, feedController.deletFeed);


router.get("/:feed_Id", authmiddleware, feedController.showDetailFeed);

//feedLike
router.post("/:feed_Id/likes", authmiddleware, feedController.likeFeed);
router.delete("/:feed_Id/unlikes", authmiddleware, feedController.unlikeFeed);

module.exports = router
