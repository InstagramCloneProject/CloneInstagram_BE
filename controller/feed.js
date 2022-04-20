const { feed, userBasic, feedLike, comment, commentLike, recomment, userFollow, userInfo, recommentLike } = require("../models")
const multer = require("multer")
const multerS3 = require("multer-s3")
const aws = require("aws-sdk")
aws.config.loadFromPath(__dirname + "/../config/s3.json") //aws키 불러오기
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const { Op } = require("sequelize")

//  전체 피드 조회
async function showFeed(req, res) {
  // #swagger.description = "여기는 피드를 조회 하는 곳 입니다.!"
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드조회"

  
  const { id, userId } = res.locals
  console.log(id,userId)
  const followUsersArray = await userFollow
    .findAll({
      where: { user_Id: id },
    })
  let followId = followUsersArray.map((value) => {
    return value.dataValues.followId
  })

  followId.push(userId)


  const showFeedUserIdArray = await userBasic.findAll({
    where: { userId: { [Op.or]: followId } },
  })

  const showFeedUser_Id = showFeedUserIdArray.map((value) => {
    return value.dataValues.id
  })

  const feedOrigin = await userBasic
    .findAll({
      where: { id: { [Op.or]: showFeedUser_Id } },
      include: [
        {
          model: feed,
          as: "feeds",
          attributes: { exclude: ["user_Id"] },
          where: { user_Id: { [Op.or]: showFeedUser_Id } },
          order: [["createdAt", "desc"]],
          limit: 3,
          include: [
            {
              model: userBasic,
              as: "user",
              attributes: ["id", "userId", "nickName"],
              include: [{
                model: userInfo,
                as: "userInfos",
                attributes: ["profileImg"]
              }]
            },

            {
              model: feedLike,
              as: "feedLikes",
              attributes: ["likeId"],
            },
            {
              model: comment,
              as: "comments",
              attributes: { exclude: ["user_Id", "feed_Id"] },
              include: [
                {
                  model: userBasic,
                  as: "user",
                  attributes: ["id", "userId", "nickname"],
                  order: [["createdAt", "desc"]],
                  include: [{
                    model: userInfo,
                    as: "userInfos",
                    attributes: ["profileImg"]
                  }]
                },
              ],
            },
          ],
        },
      ],
    })

  let feedList = []
  const Feed = feedOrigin.map((value) => {
    return value.dataValues
  })
  for (let i = 0; i < Feed.length; i++) {
    let realFeed = Feed[i].feeds
    for (let z = 0; z < realFeed.length; z++) {
      let oneFeed = realFeed[z]
      feedList.push(oneFeed)
    }
  }

  // 팔로우 안한 유저 중에 랜덤하게 5명 데이터 보내기(1안)
  const followerUserOrigin = await userFollow.findAll({
    attributes: ["followId"],
    where: { user_Id: id },
  })
  let followUserList = followerUserOrigin.map((value) => {
    return value.dataValues.followId
  })

  followUserList.push(userId)

  const unfollowList = await userBasic.findAll({
    where: { userId: { [Op.notIn]: followUserList } },
    attributes: ["userId", "nickName", "id"],
    include: [
      {
        model: userInfo,
        as: "userInfos",
        attributes: ["profileImg"],
      },
    ],
  })

  res.status(200).json({ success: true, feedList, unfollowList })
}

// 상세 페이지
async function showDetailFeed(req, res) {
  // #swagger.description = "여기는 피드를 상세조회 하는 곳 입니다."
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드상세조회"
  const { feed_Id } = req.params
  const Feed = await feed.findAll({
    where: { id: feed_Id },
    attributes: { exclude: ["user_Id"] },
    include: [
      {
        model: feedLike,
        as: "feedLikes",
        attributes: ["likeId"]
      },
      {
        model: userBasic,
        as: "user",
        attributes: ["id", "userId", "nickName"],
        include: [
          {
            model: userInfo,
            as: "userInfos",
            attributes: ["profileImg"]
          }
        ]
      },
      {
        model: comment,
        as: "comments",
        attributes: { exclude: ["feed_Id", "user_Id"] },
        include: [
          {
            model: commentLike,
            as: "commentLikes",
            attributes: ["likeId"]
          },
          {
            model: userBasic,
            as: "user",
            attributes: ["id", "userId", "nickName"],
            include: [
              {
                model: userInfo,
                as: "userInfos",
                attributes: ["profileImg"]
              }
            ]
          },
          {
            model: recomment,
            as: "recomments",
            attributes: { exclude: ["comment_Id", "user_Id"] },
            include: [
              {
                model: recommentLike,
                as: "recommentLikes",
                attributes: ["likeId"]
              },
              {
                model: userBasic,
                as: "user",
                attributes: ["id", "userId", "nickName"],
                include: [
                  {
                    model: userInfo,
                    as: "userInfos",
                    attributes: ["profileImg"]
                  }
                ]
              },
            ],
          },
        ],
      },
    ],
  })

  res.status(200).json({ Feed })
}

const s3 = new aws.S3()
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cloneproject-instagram/feedImage",
    acl: "public-read",
    key: function (req, file, cb) {
      //파일이름 설정
      let ext = path.extname(file.originalname) // 파일의 확장자
      let randomName = uuidv4(file.originalname) //파일이름을 랜덤하게 부여
      cb(null, randomName + ext)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb로 용량 제한
})

//  피드 작성
async function applyFeed(req, res) {
  // #swagger.description = "여기는 피드를 작성 하는 곳 입니다."
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드작성"
  const { content } = req.body
  const { id } = res.locals
  if (!req.file) return res.status(400).json({ message: "이미지를 넣어주세요" }) //이미지 없을때

  try {
    const findFeed = await feed.create({ content, user_Id: id, feedImg: req.file.location }) //피드 생성
    res.status(200).json({ success: true, feedId: findFeed.id, feedCreatedAt: findFeed.createdAt })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// 피드 수정
async function updateFeed(req, res) {
  // #swagger.description = "여기는 피드를 수정 하는 곳 입니다."
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드수정"
  const { id } = res.locals //로그인 한 유저 정보
  const userCheck = await feed.findOne({ where: { user_Id: id } }) //피드에서 해당 유저 찾기
  if (!userCheck) return res.status(400).json({ messeage: "수정 권한이 없습니다." }) //없으면 수정 불가
  const { content } = req.body
  const { feed_Id } = req.params
  const checkFeedId = await feed.findOne({ where: { id: feed_Id } }) //피드가 있는지 체크
  if (!checkFeedId) return res.status(400).json({ messeage: "해당 피드가 존재하지 않습니다." })
  try {
    await feed.update({ content }, { where: { id: feed_Id } }) //피드 수정
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

async function deletFeed(req, res) {
  // #swagger.description = "여기는 피드를 삭제 하는 곳 입니다."
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드삭제"
  const { id } = res.locals //로그인 한 유저 정보
  const userCheck = await feed.findOne({ where: { user_Id: id } }) //피드에서 해당 유저 찾기
  if (!userCheck) return res.status(400).json({ messeage: "삭제 권한이 없습니다." }) //없으면 삭제 불가
  const { feed_Id } = req.params
  const checkFeedId = await feed.findOne({ where: { id: feed_Id } })
  if (!checkFeedId) return res.status(400).json({ messeage: "해당 피드가 존재하지 않습니다." }) //안해주면 피드가 없어서 삭제는 안되지만 성공으로 들어감 이유는?
  const { image } = req.body //삭제할 이미지 url
  console.log(image)
  const findImg = image.split("/feedImage/")[1]
  try {
    await feed.destroy({ where: { id: feed_Id } }) //피드삭제
    s3.deleteObject({ Bucket: "cloneproject-instagram", Key: `feedImage/${findImg}` }, (err) => console.log(err))
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

async function likeFeed(req, res) {
  // #swagger.description = "여기는 피드좋아요를 하는 곳 입니다."
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드좋아요"
  const { feed_Id } = req.params //어떤 피드에 좋아요
  const { id, userId } = res.locals //로그인 한 유저
  try {
    await feedLike.create({ feed_Id, likeId: userId, user_Id: id }) //좋아요 누른 피드 ,유저 추가
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

async function unlikeFeed(req, res) {
  // #swagger.description = "여기는 피드좋아요 취소를 하는 곳 입니다."
  // #swagger.tags = ["Feed"]
  // #swagger.summary = "피드좋아요 취소"
  const { feed_Id } = req.params
  const { userId } = res.locals
  const checkFeedId = await feed.findOne({ where: { id: feed_Id } }) //피드 체크
  const userUnlike = await userBasic.findOne({ where: { userId } }) //유저체크
  try {
    if (!checkFeedId) return res.status(400).json({ messeage: "해당 피드가 존재하지 않습니다." })
    if (!userUnlike) return res.status(400).json({ messeage: "좋아요를 누른 유저가 아닙니다." })
    await feedLike.destroy({
      //피드와 취소를 누른 유저의 좋아요데이터 삭제
      where: {
        feed_Id,
        user_Id: userUnlike.id,
      },
    })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

module.exports = {
  showFeed,
  applyFeed,
  updateFeed,
  deletFeed,
  likeFeed,
  unlikeFeed,
  upload,
  showDetailFeed,
}
