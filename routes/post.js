const router = require("express").Router();
const postController = require("../controller/post");

// router.get("/", postController);
router.post("/", postController.applyPost);
router.patch("/:postId/likes", postController.likePost);
// router.patch("/", postController);
// router.delete("/", postController);

module.exports = router;
