const { recomment } = require('../models/index')

async function applyRecomment(req, res) {
	const { content } = req.body
	const { user_Id, comment_Id } = req.body

	await recomment.create({ content, user_Id, comment_Id })

	res.json({ success: true })
}

module.exports = {
	applyRecomment
}