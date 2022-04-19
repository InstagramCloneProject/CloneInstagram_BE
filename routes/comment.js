const router = require("express").Router();
const commentController = require("../controller/comment");
const authmiddleware = require("../middlewares/auth")

// 댓글 작성
router.post("/", authmiddleware, commentController.applyComment);

// 댓글 수정
router.patch("/:comment_Id", authmiddleware, commentController.updateComment);

// 댓글 삭제
router.delete("/:comment_Id", authmiddleware, commentController.deleteComment);

// 댓글 좋아요 추가
router.post("/:comment_Id/likes", authmiddleware, commentController.likeComment);

// 댓글 좋아요 취소
router.delete("/:comment_Id/unlikes", authmiddleware, commentController.unlikeComment);

module.exports = router;
