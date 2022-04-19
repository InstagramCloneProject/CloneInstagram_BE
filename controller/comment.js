const { comment, commentLike } = require("../models/index")

async function applyComment(req, res) {
  // #swagger.description = "여기는 댓글을 작성하는 곳 입니다."
  // #swagger.tags = ["Comment"]
  // #swagger.summary = "댓글작성"
  const { content, feed_Id } = req.body
  const { id } = res.locals

  await comment.create({ content, user_Id: id, feed_Id })

  res.json({ success: true })
}

async function updateComment(req, res) {
  // #swagger.description = "여기는 댓글을 수정 하는 곳 입니다."
  // #swagger.tags = ["Comment"]
  // #swagger.summary = "댓글수정"
  const { comment_Id } = req.params
  const { content } = req.body

  await comment.update({ content }, { where: { id: comment_Id } })

  res.json({ success: true })
}

async function deleteComment(req, res) {
  // #swagger.description = "여기는 댓글을 삭제 하는 곳 입니다."
  // #swagger.tags = ["Comment"]
  // #swagger.summary = "댓글삭제"
  const { comment_Id } = req.params

  await comment.destroy({ where: { id: comment_Id } })

  res.json({ success: true })
}

async function likeComment(req, res) {
  // #swagger.description = "여기는 댓글좋아요 하는 곳 입니다."
  // #swagger.tags = ["Comment"]
  // #swagger.summary = "댓글좋아요"
  const { comment_Id } = req.params
  const { likeId } = req.body
  const { id } = res.locals
  await commentLike.create({ comment_Id, likeId, user_Id: id })
  res.json({ success: true })
}

async function unlikeComment(req, res) {
  // #swagger.description = "여기는 댓글좋아요 취소 하는 곳 입니다."
  // #swagger.tags = ["Comment"]
  // #swagger.summary = "댓글좋아요 취소"
  const { comment_Id } = req.params
  const { id } = res.locals

  await commentLike.destroy({ where: { comment_Id, user_Id: id } })
  res.json({ success: true })
}

module.exports = {
  applyComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
}
