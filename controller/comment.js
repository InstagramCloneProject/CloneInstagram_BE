const { comment, commentLike } = require('../models/index')

async function applyComment(req, res) {
	const { content, feed_Id } = req.body
	const { id } = res.locals

	await comment.create({ content, user_Id: id, feed_Id })

	res.json({ success: true })
}

async function updateComment(req, res) {
	const { comment_Id } = req.params
	const { content } = req.body

	await comment.update({ content }, { where: { id: comment_Id } })

	res.json({ success: true })
}

async function deleteComment(req, res) {
	const { comment_Id } = req.params

	await comment.destroy({ where: { id: comment_Id } })

	res.json({ success: true })
}

async function likeComment(req, res) {
	const { comment_Id } = req.params
	const { id, userId } = res.locals

	await commentLike.create({ comment_Id, likeId: userId , user_Id: id })

	res.json({ success: true })
}

async function unlikeComment(req, res) {
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
	unlikeComment
}