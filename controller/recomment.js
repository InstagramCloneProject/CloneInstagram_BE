const { recomment, recommentLike } = require('../models/index')

async function applyRecomment(req, res) {
	const { content, comment_Id } = req.body
	const { id } = res.locals


	await recomment.create({ content, user_Id: id, comment_Id })

	res.json({ success: true })
}

async function updateRecomment(req, res) {
	const { recomment_Id } = req.params
	const { content } = req.body

	await recomment.update({ content }, { where: { id: recomment_Id } })

	res.json({ success: true })
}

async function deleteRecomment(req, res) {
	const { recomment_Id } = req.params

	await recomment.destroy({ where: { id: recomment_Id } })

	res.json({ success: true })
}

async function likeRecomment(req, res) {
	const { recomment_Id } = req.params
	const { id, userId } = res.locals

	await recommentLike.create({ recomment_Id, likeId: userId, user_Id: id })

	res.json({ success: true })
}

async function unlikeRecomment(req, res) {
	const { recomment_Id } = req.params
	const { id } = res.locals

	await recommentLike.destroy({ where: { recomment_Id, user_Id: id } })
	res.json({ success: true })
}

module.exports = {
	applyRecomment,
	updateRecomment,
	deleteRecomment,
	likeRecomment,
	unlikeRecomment
}