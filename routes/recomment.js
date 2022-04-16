const router = require("express").Router();
const recommentController = require("../controller/recomment");

// 대댓글 작성
router.post("/", recommentController.applyRecomment);

// 대댓글 수정
router.patch("/:recomment_Id", recommentController.updateRecomment);

// 대댓글 삭제
router.delete("/:recomment_Id", recommentController.deleteRecomment);

// 대댓글 좋아요 추가
router.post("/:recomment_Id/likes", recommentController.likeRecomment);

// 대댓글 좋아요 삭제
router.delete("/:recomment_Id/unlikes", recommentController.unlikeRecomment);

module.exports = router;