const router = require("express").Router();
const recommentController = require("../controller/recomment");
const authmiddleware = require("../middlewares/auth")

// 대댓글 작성
router.post("/", authmiddleware, recommentController.applyRecomment);

// 대댓글 수정
router.patch("/:recomment_Id", authmiddleware, recommentController.updateRecomment);

// 대댓글 삭제
router.delete("/:recomment_Id", authmiddleware, recommentController.deleteRecomment);

// 대댓글 좋아요 추가
router.post("/:recomment_Id/likes", authmiddleware, recommentController.likeRecomment);

// 대댓글 좋아요 삭제
router.delete("/:recomment_Id/unlikes", authmiddleware, recommentController.unlikeRecomment);

module.exports = router;
