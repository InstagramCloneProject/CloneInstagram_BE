const { userBasic, userFollow } = require('../models/index')

async function join(req, res) {
	const { userId } = req.body
	const { nickName, password } = req.body

	await userBasic.create({ userId, nickName, password })

	res.json({ success: true })
}

async function follow(req, res) {
	const user_Id = req.params.userId
	const { followId } = req.body

	await userFollow.create({ user_Id, followId })

	res.json({ success: true })
}

module.exports = {
	join,
	follow
}