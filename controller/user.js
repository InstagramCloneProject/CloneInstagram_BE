const { feed, userBasic, feedLike, comment, commentLike, recomment, userFollow, userInfo, recommentLike } = require("../models/index")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { exist } = require("joi")

// about multer and s3
const multer = require("multer")
const multerS3 = require("multer-s3")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const aws = require("aws-sdk")
aws.config.loadFromPath(__dirname + "/../config/s3.json")

require("dotenv").config()
const saltRounds = process.env.SALT

// About register and login
async function join(req, res) {
  // #swagger.description = "여기는 회원가입 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "회원가입"

  const { userId } = req.body
  const { nickName, password } = req.body
  // DB에 동일한 userId를 가진 데이터가 있는지 확인하기
  const existUser = await userBasic.findOne({ where: { userId } })
  if (existUser) {
    res.status(400).json({ success: false, message: "이미 가입된 아이디가 있습니다." })
    return
  }
  const pw_hash = await bcrypt.hash(password, Number(saltRounds)).then((value) => {
    return value
  })
  let user
  await userBasic.create({ userId, nickName, password: pw_hash }).then((value) => {
    user = value
  })
  const user_Id = user.dataValues.id
  await userInfo.create({ user_Id, profileImg: process.env.DEFAULT_PROFILEIMG })
  res.status(201).json({ success: true, message: "회원가입에 성공했습니다." })
}

async function login(req, res) {
  // #swagger.description = "여기는 로그인 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "로그인"

  const { userId, password } = req.body
  // userId의 password 찾기
  const existUser = await userBasic.findOne({ where: { userId } })
  if (!existUser) {
    res.status(400).json({ success: false, message: "아이디를 확인해주세요." })
    return
  }
  const userPassword = await userBasic.findOne({ where: { userId } }).then((value) => {
    return value.password
  })
  //  입력된 비밀번호와 DB 비밀번호 비교
  const passwordCheck = await bcrypt.compare(password, userPassword)

  if (passwordCheck === false) {
    res.status(400).json({ success: false, message: "비밀번호를 확인해주세요." })
    return
  }
  // 모두 확인되면, userId로 토큰 발급하기.
  const user = await userBasic.findOne({ where: { userId } })
  const profileImg = await userInfo.findOne({ where: { user_Id: user.id } })

  const accessToken = jwt.sign({ user_Id: user.id, userId: user.userId, nickName: user.nickName, profileImg: profileImg.profileImg }, process.env.SECRET_KEY, {
    expiresIn: process.env.ACCESS_EXPIRED,
  })
  const refreshToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: process.env.REFRESH_EXPIRED })
  // await userBasic.update({ refreshToken }, { where: { userId } })
  res.status(200).json({ success: true, accessToken, refreshToken })
}
// About follow
// TODO: FollowId가 db 정보에 있는 것인지 검토해야하나?
async function follow(req, res) {
  // #swagger.description = "여기는 팔로우 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "팔로우 추가"

  const user_Id = req.params.user_Id // 팔로우 버튼 클릭한 유저
  const { followId } = req.body // 유저가 팔로우한 ID
  await userFollow.create({ user_Id, followId })
  res.json({ success: true })
}

async function unfollow(req, res) {
  // #swagger.description = "여기는 언팔로우 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "팔로우 삭제"

  const { user_Id } = req.params
  const { followId } = req.body
  await userFollow.destroy({ where: { user_Id, followId } })
  res.json({ success: true })
}

// About profileImg
// multer set: request로 들어온 파일을 저장할 위치, 파일의 규격 지정.

async function showMyPage(req, res) {
  // #swagger.description = "여기는 개인 프로필 페이지를 조회 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "개인 프로필 페이지 조회"

  const { id } = res.locals
  const { user_Id } = req.params //유저 받기
  const follow = await userBasic.findOne({ where: { id: user_Id } }) // 유저정보 찾기
  const follower = await userFollow.findAll({ where: { followId: follow.userId } }) //나를 팔로우 한 수
  const following = await userFollow.findAll({ where: { user_Id } }) // 내가 팔로우 한 수

  const user = await userBasic.findOne({
    where: {
      id: user_Id,
    },
    attributes: ["userId", "nickName"],
    include: {
      model: userInfo,
      as: "userInfos",
      attributes: ["profileImg"],
    },
  })

  // 유저의 팔로우 여부 확인 ( 0 == 언팔, 1 == 팔로우)
  const followJudge = await userFollow.findAll({ where: { user_Id: id, followId: follow.userId } })

  let followTrue
  if (followJudge.length === 0) {
    followTrue = false
  } else {
    followTrue = true
  }


  const feeds = await feed.findAll({
    where: { user_Id },
    order: [["createdAt", "DESC"]],
    attributes: ["id", "feedImg"],
    include: [
      {
        model: comment,
        as: "comments",
        attributes: ["id"],
      },
      {
        model: feedLike,
        as: "feedLikes",
        attributes: ["id"],
      },
    ],
  })
  res.json({
    user,
    followTrue,
    feedCount: {
      count: feeds.length,
    },
    follow: {
      follower: follower.length,
      following: following.length,
    },
    feeds: feeds.map((value) => {
      return {
        feedId: value.id,
        feedImage: value.feedImg,
        feedLikesCount: value.feedLikes.length,
        comment: value.comments.length,
      }
    }),
  })
}

const s3 = new aws.S3()
const upload = multer({
  storage: multerS3({
    // 저장한공간 정보 : 하드디스크에 저장
    s3: s3,
    bucket: "cloneproject-instagram/profileImg",
    acl: "public-read",
    key: function (req, file, cb) {
      //파일이름 설정
      let ext = path.extname(file.originalname) // 파일의 확장자
      let randomName = uuidv4(file.originalname) //파일이름을 랜덤하게 부여
      cb(null, randomName + ext)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 10mb로 용량 제한
})

async function updateProfileImg(req, res) {
  // #swagger.description = "여기는 프로필 이미지를 수정 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "프로필 이미지 수정"
  const { user_Id } = req.params
  const userProfile = await userInfo.findOne({
    where: {
      user_Id,
    },
    attributes: ["profileImg"],
  }) //유저의 수정 전 프로필 사진

  if (userProfile.profileImg !== process.env.DEFAULT_PROFILEIMG) {
    //기본 이미지는 삭제 못하게
    const findImg = userProfile.profileImg.split("/profileImg/")[1]
    s3.deleteObject({ Bucket: "cloneproject-instagram", Key: `profileImg/${findImg}` }, (err) => console.log(err))
  }


  const updateProfileImg = req.file.location //수정 할 이미지
  await userInfo.update({ profileImg: updateProfileImg }, { where: { user_Id } })
  res.status(200).json({ success: true })
}

async function deleteProfileImg(req, res) {
  // #swagger.description = "여기는 프로필 이미지를 삭제 하는 곳 입니다."
  // #swagger.tags = ["User"]
  // #swagger.summary = "프로필 이미지 삭제"

  const { user_Id } = req.params
  const userProfile = await userInfo.findOne({
    where: {
      user_Id,
    },
    attributes: ["profileImg"],
  })

  if (userProfile.profileImg !== process.env.DEFAULT_PROFILEIMG) {
    //기본 이미지는 삭제 못하게
    const findImg = userProfile.profileImg.split("/profileImg/")[1]
    s3.deleteObject({ Bucket: "cloneproject-instagram", Key: `profileImg/${findImg}` }, (err) => console.log(err))
  } else {
    return res.status(400).json({ message: "Stop!!! 기본이미지 입니다" })
  }

  await userInfo.update({ profileImg: process.env.DEFAULT_PROFILEIMG }, { where: { user_Id } })
  res.status(200).json({ success: true })
}

module.exports = {
  join,
  follow,
  login,
  unfollow,
  upload,
  updateProfileImg,
  deleteProfileImg,
  showMyPage,
}
