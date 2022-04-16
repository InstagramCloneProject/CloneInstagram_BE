const router = require("express").Router();
const commentController = require("../controller/comment");

// 댓글 작성
router.post("/", commentController.applyComment);

// 댓글 수정
router.patch("/:comment_Id", commentController.updateComment);

// 댓글 삭제
router.delete("/:comment_Id", commentController.deleteComment);

// 댓글 좋아요 추가
router.post("/:comment_Id/likes", commentController.likeComment);

// 댓글 좋아요 취소
router.delete("/:comment_Id/unlikes", commentController.unlikeComment);

module.exports = router;
