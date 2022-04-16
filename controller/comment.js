const { comment } = require('../models/index')

async function applyComment(req, res) {
	const { content } = req.body
	const { user_Id, feed_Id } = req.body

	await comment.create( { content, user_Id, feed_Id } )

	res.json({ success: true })
}

async function updateComment(req, res) {
	const { comment_Id } = req.params
	const { content } = req.body

	await comment.update( { content }, { where: { id: comment_Id } } )

	res.json({ success: true })
}

async function deleteComment(req, res) {
	const { comment_Id } = req.params

	await comment.destroy({ where: { id: comment_Id } })

	res.json({ success: true })
}

async function likeComment(req, res) {
	const { comment_Id } = req.params
	const { likeId, user_Id } = req.body

	await commentLike.create({ comment_Id, likeId, user_Id })

	res.json({ success: true })
}

async function unlikeComment(req, res) {
	const { comment_Id } = req.params
	const { user_Id } = req.body

	await commentLike.destroy({ where: { comment_Id, user_Id } })
	res.json({ success: true })
}

module.exports = {
	applyComment,
	updateComment,
	deleteComment,
	likeComment,
	unlikeComment
}