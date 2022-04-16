const { userBasic, userFollow, feed } = require('../models/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { exist } = require('joi')
require('dotenv').config()
const saltRounds = process.env.SALT

async function join(req, res) {
	const { userId } = req.body
	const { nickName, password } = req.body
	// DB에 동일한 userId를 가진 데이터가 있는지 확인하기
	const existUser = await userBasic.findOne({ where: { userId } })
	console.log(saltRounds)
	if (existUser) {
		res.status(400).json({ success: false, errormsg: '이미 가입된 아이디가 있습니다.' })
		return
	}
	const pw_hash = await bcrypt.hash(password, Number(saltRounds)).then((value) => { return value })
	await userBasic.create({ userId, nickName, password: pw_hash })
	res.status(201).json({ success: true, msg: '회원가입에 성공했습니다.' })
}

async function login(req, res) {
	const { userId, password } = req.body
	// userId의 password 찾기
	const existUser = await userBasic.findOne({ where: { userId } })
	if (!existUser) {
		res.status(400).json({ success: false, errormsg: '아이디를 확인해주세요.' })
		return
	}
	const userPassword = await userBasic.findOne({ where: { userId } }).then((value) => { return value.password })
	//  입력된 비밀번호와 DB 비밀번호 비교
	const passwordCheck = await bcrypt.compare(password, userPassword)

	if (passwordCheck === false) {
		res.status(400).json({ success: false, errormsg: '비밀번호를 확인해주세요.' })
		return
	}
	// 모두 확인되면, userId로 토큰 발급하기.
	const user = await userBasic.findOne({ where: { userId } })
	const accessToken = jwt.sign({ userId: user.userId, nickName: user.nickName }, process.env.SECRET_KEY, { expiresIn: '30s' })
	const refreshToken = jwt.sign({}, process.env.SECRET_KEY, { expiresIn: '60s' })
	await userBasic.update({ refreshToken }, { where: { userId } })
	res.status(200).json({ success: true, accessToken, refreshToken })
}

//  TODO: multer 적용하기
// async function addprofileImg(req, res) {
// 	const { user_Id } = req.params
// 	const { profileImg } = req.body

// }
// TODO: FollowId가 db 정보에 있는 것인지 검토해야하나?
async function follow(req, res) {
	const user_Id = req.params.user_Id // 팔로우 버튼 클릭한 유저
	const { followId } = req.body // 유저가 팔로우한 ID
	await userFollow.create({ user_Id, followId })
	const fileImg = await feed.findOne({ where: { id: 10 } }).then((value) => { return value.feedImg })
	var filename = '/uploads' + fileImg + '.jpg'
	console.log(fileImg)
	res.json({ success: true })
}

async function unfollow(req, res) {

	const { user_Id } = req.params
	console.log(user_Id)
	const { followId } = req.body
	await userFollow.destroy({ where: { user_Id, followId } })
	res.json({ success: true })
}

module.exports = {
	join,
	follow,
	login,
	unfollow
}