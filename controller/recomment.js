const { recomment } = require('../models/index')

async function applyRecomment(req, res) {
	const { content } = req.body
	const { user_Id, comment_Id } = req.body

	await recomment.create({ content, user_Id, comment_Id })

	res.json({ success: true })
}

async function updateRecomment(req, res) {
	const { recomment_Id } = req.params
	const { content } = req.body

	await recomment.update( { content }, { where: { id: recomment_Id } } )

	res.json({ success: true })
}

async function deleteRecomment(req, res) {
	const { recomment_Id } = req.params

	await recomment.destroy({ where: { id: recomment_Id } })

	res.json({ success: true })
}

async function likeRecomment(req, res) {
	const { recomment_Id } = req.params
	const { likeId, user_Id } = req.body

	await recommentLike.create({ recomment_Id, likeId, user_Id })

	res.json({ success: true })
}

async function unlikeRecomment(req, res) {
	const { recomment_Id } = req.params
	const { user_Id } = req.body

	await recommentLike.destroy({ where: { recomment_Id, user_Id } })
	res.json({ success: true })
}

module.exports = {
	applyRecomment,
	updateRecomment,
	deleteRecomment,
	likeRecomment,
	unlikeRecomment
}