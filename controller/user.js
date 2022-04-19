
const { feed, userBasic, feedLike, comment, commentLike, recomment, userFollow, userInfo, recommentLike } = require('../models/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { exist } = require('joi')


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
  const { userId } = req.body
  const { nickName, password } = req.body
  // DB에 동일한 userId를 가진 데이터가 있는지 확인하기
  const existUser = await userBasic.findOne({ where: { userId } })
  if (existUser) {
    res.status(400).json({ success: false, errormsg: "이미 가입된 아이디가 있습니다." })
    return
  }
  const pw_hash = await bcrypt.hash(password, Number(saltRounds)).then((value) => {
    return value
  })
  let user
  await userBasic.create({ userId, nickName, password: pw_hash }).then((value) => {
    user = value
  }
  )
  const user_Id = user.dataValues.id
  await userInfo.create({ user_Id, profileImg: process.env.DEFAULT_PROFILEIMG })
  res.status(201).json({ success: true, msg: "회원가입에 성공했습니다." })
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
  const profileImg = await userInfo.findOne({ where: { user_Id: user.id } })
  const accessToken = jwt.sign(
    { userId: user.userId, nickName: user.nickName, profileImg: profileImg.profileImg },
    process.env.SECRET_KEY,
    { expiresIn: process.env.ACCESS_EXPIRED })
  const refreshToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY,
    { expiresIn: process.env.REFRESH_EXPIRED })
  // await userBasic.update({ refreshToken }, { where: { userId } })
  res.status(200).json({ success: true, accessToken, refreshToken })
}
// About follow
// TODO: FollowId가 db 정보에 있는 것인지 검토해야하나?
async function follow(req, res) {
  const user_Id = req.params.user_Id // 팔로우 버튼 클릭한 유저
  const { followId } = req.body // 유저가 팔로우한 ID
  await userFollow.create({ user_Id, followId })
  res.json({ success: true })
}

async function unfollow(req, res) {
  const { user_Id } = req.params
  console.log(user_Id)
  const { followId } = req.body
  await userFollow.destroy({ where: { user_Id, followId } })
  res.json({ success: true })
}

// About profileImg
// multer set: request로 들어온 파일을 저장할 위치, 파일의 규격 지정.
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

async function showMyPage(req, res) {
  const { user_Id } = req.params //유저 받기
  const follow = await userBasic.findOne({ where: { id: user_Id } }) // 유저정보 찾기

  const follower = await userFollow.findAll({ where: { followId: follow.userId } }) //

  console.log(follower.length)

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
      {
        model: userBasic,
        as: "user",
        attributes: ["userId", "nickName"],
        include: [
          {
            model: userInfo,
            as: "userInfos",
            attributes: ["profileImg"],
          },
          {
            model: userFollow,
            as: "userFollows", //내가 팔로우 한 사람 : 팔로잉
          },
        ],
      },
    ],
  })
  console.log("피드 개수: " + feeds.length)
  feeds.map((value) => {
    console.log("피드 이미지 :" + value.feedImg)
    console.log("댓글 수 :" + value.comments.length)
    console.log("좋아요 수 :" + value.feedLikes.length)
    console.log("유저 아이디 :" + value.user.userId)
    console.log("유저 닉네임 :" + value.user.nickName)
    console.log("유저 프로필 :" + value.user.userInfos[0].profileImg)
    console.log("내가 팔로우 한 수: " + value.user.userFollows.length)
    console.log("내가 팔로잉 한 수: " + follower.length)
  })
  //피드 이미지, 피드 개수
  //댓글 개수
  //유저 닉네임, 유저 아이디, 유저 프로필 사진
  //유저 팔로워 , 팔로잉 수
  res.json({
    feeds: feeds.map((value) => {
      return {
        feedCount: feeds.length,
        feedImage: value.feedImg,
        feedLikesCount: value.feedLikes.length,
        comment: value.comments.length,
        userId: value.user.userId,
        nickname: value.user.nickName,
        ProfileImg: value.user.userInfos[0].profileImg,
        followCount: value.user.userFollows.length,
        followingCount: follower.length,
      }
    }),
  })
}
async function applyProfileImg(req, res) {
  const { user_Id } = req.params
  if (!req.file) return res.status(400).json({ errormsg: "이미지를 넣어주세요." })
  console.log(req.file)
  console.log(req.file.location)
  const profileImg = req.file.location
  await userInfo.update({ profileImg }, { where: { user_Id } })
  res.status(200).json({ success: true })
}

async function updateProfileImg(req, res) {
  const { user_Id } = req.params
  const updateProfileImg = req.file.location
  await userInfo.update({ profileImg: updateProfileImg }, { where: { user_Id } })
  res.status(200).json({ success: true })
}

async function deleteProfileImg(req, res) {
  const { user_Id } = req.params
  await userInfo.update({ profileImg: process.env.DEFAULT_PROFILEIMG }, { where: { user_Id } })
  res.status(200).json({ success: true })
}

async function showMyPage(req, res) {
  const { user_Id } = req.params; //유저 받기
  const follow = await userBasic.findOne({ where: { id: user_Id } }); // 유저정보 찾기
  const follower = await userFollow.findAll({ where: { followId: follow.userId } }); //나를 팔로우 하는 아이디
  follower.map((id) => console.log(id.id));
  const mypage = await userBasic.findAll({
    where: {
      id: user_Id,
    },
    attributes: ["userId", "nickName"],
    include: [
      {
        model: userFollow,
        as: "userFollows",
        attributes: ["followId"], //내가 팔로우 하는 아이디 {
      },
      { model: userInfo, as: "userInfos", attributes: ["profileImg"] },
      {
        model: feed,
        as: "feeds",
        attributes: ["feedImg"],
      },
    ],
  });
  res.json({
    result: mypage.map((value) => {
      return {
        userId: value.userId,
        nickname: value.nickName,
        profileImg: value.userInfos[0].profileImg,
        feedCount: value.feeds.length,
        feedImg: value.feeds,
        follower: follower.length,
        following: value.userFollows.length,
      };
    }),
  });
}

module.exports = {
  join,
  follow,
  login,
  unfollow,
  upload,
  applyProfileImg,
  updateProfileImg,
  deleteProfileImg,
  showMyPage
}

