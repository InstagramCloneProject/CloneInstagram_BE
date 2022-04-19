const { recomment, recommentLike } = require('../models/index')

async function applyRecomment(req, res) {
	// #swagger.description = "여기는 대댓글을 작성하는 곳 입니다."
	// #swagger.tags = ["Recomment"]
	// #swagger.summary = "대댓글작성"
	/* #swagger.responses[200] = {
				schema: {
					success : true
				}
		  } */
	const { content, comment_Id } = req.body
	const { id } = res.locals

	await recomment.create({ content, user_Id: id, comment_Id })

	res.status(200).json({ success: true })
}

async function updateRecomment(req, res) {
	// #swagger.description = "여기는 대댓글을 수정하는 곳 입니다."
	// #swagger.tags = ["Recomment"]
	// #swagger.summary = "대댓글수정"
	/* #swagger.responses[200] = {
				schema: {
					success : true
				}
		  } */
	const { recomment_Id } = req.params
	const { content } = req.body

	await recomment.update({ content }, { where: { id: recomment_Id } })

	res.status(200).json({ success: true })
}

async function deleteRecomment(req, res) {
	// #swagger.description = "여기는 대댓글을 작성하는 곳 입니다."
	// #swagger.tags = ["Recomment"]
	// #swagger.summary = "대댓글삭제"
	/* #swagger.responses[200] = {
				schema: {
					success : true
				}
		  } */
	const { recomment_Id } = req.params

	await recomment.destroy({ where: { id: recomment_Id } })

	res.status(200).json({ success: true })
}

async function likeRecomment(req, res) {
	// #swagger.description = "여기는 대댓글좋아요 하는 곳 입니다."
	// #swagger.tags = ["Recomment"]
	// #swagger.summary = "대댓글좋아요"
	/* #swagger.responses[200] = {
				schema: {
					success : true
				}
		  } */
	const { recomment_Id } = req.params
	const { id, userId } = res.locals

	await recommentLike.create({ recomment_Id, likeId: userId, user_Id: id })

	res.status(200).json({ success: true })
}

async function unlikeRecomment(req, res) {
	// #swagger.description = "여기는 대댓글좋아요 취소 하는 곳 입니다."
	// #swagger.tags = ["Recomment"]
	// #swagger.summary = "대댓글좋아요 취소"
	/* #swagger.responses[200] = {
				schema: {
					success : true
				}
		  } */
	const { recomment_Id } = req.params
	const { id } = res.locals

	await recommentLike.destroy({ where: { recomment_Id, user_Id: id } })

	res.status(200).json({ success: true })
}

module.exports = {
	applyRecomment,
	updateRecomment,
	deleteRecomment,
	likeRecomment,
	unlikeRecomment
}