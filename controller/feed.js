const { feed, feedLike } = require('../models/index')

async function applyPost(req, res) {
	const { content } = req.body
	const { user_Id, nickName, feedImg } = req.body

	await feed.create({ content, user_Id, nickName, feedImg })

	res.json({ success: true })
}

async function likePost(req, res) {
	const feed_Id = req.params.feedId
	const { likeId, user_Id } = req.body

	await feedLike.create({ feed_Id, likeId, user_Id })

	res.json({ success: true })
}

async function deletePost(req, res) {
	const feed_Id = req.params.feedId

	await feed.destroy({ where: { id: feed_Id } })

	res.json({ success: true })
}

module.exports = {
	applyPost,
	likePost,
	deletePost
}