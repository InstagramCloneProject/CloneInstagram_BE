const router = require("express").Router();
const commentController = require("../controller/comment");

// router.get("/", cccController);
router.post("/", commentController.applyComment);
// router.patch("/", cccController);
// router.delete("/", cccController);

module.exports = router;
