const { feed, userBasic, feedLike, comment, commentLike, recomment, userFollow, userInfo } = require("../models");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
aws.config.loadFromPath(__dirname + "/../config/s3.json"); //aws키 불러오기
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

async function showFeed(req, res) {
  let id = 1;

  const follows = await userFollow.findAll({ where: { user_Id: id } });

  const followId = follows.map((follow) => follow.followId);

  const findUser = await userBasic.findAll({
    where: {
      userId: {
        [Op.or]: followId,
      },
    },
  });

  const findUserId = findUser.map((userId) => userId.id);

  const UserFeed = await userBasic.findAll({
    attributes: ["userId", "nickName"],
    where: {
      id: {
        [Op.or]: findUserId,
      },
    },
    include: [
      {
        model: userInfo, // 팔로우한 사용자 정보
        as: "userInfos",
        attributes: ["profileImg"],
      },
      {
        model: feed, //팔로우한 사용자 피드내용
        order: [["createdAt", "DESC"]],
        limit: 3,
        as: "feeds",
        include: [
          {
            model: feedLike, //해당 피드의 좋아요 정보
            as: "feedLikes",
          },
          {
            model: comment, //해당 피드의 댓글 정보
            as: "comments",
            include: {
              model: userBasic, //해당 댓글의 유저 정보
              as: "user",
            },
          },
        ],
      },
    ],
  });

  // UserFeed.map((feeds) => {
  //   console.log(feeds.nickName);
  //   console.log(feeds.userInfos[0].profileImg);
  //   feeds.feeds.find((feedData) => {
  //     console.log(feedData.feedImg);
  //     console.log(feedData.content);
  //   });
  // console.log(feeds.feeds.feedImg);
  // console.log(feeds.feeds.content);
  // console.log(feeds.user.nickName);
  // console.log(feeds.feedLikes.length);
  // console.log(feeds.comments);
  //}),
  res.status(200).json({ UserFeed });
  // feed: UserFeed.map((feeds) => {
  //   return {
  //
  //     feedImg: feeds.feed.feedImg,
  //     content: feeds.feeds.content,
  //     nickname: feeds.user.nickName,
  //     feedLikeCount: feeds.feedLikes.length,
  //     comment: feeds.comments,
  //   };
  // }),
}

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cloneproject-instagram/feedImage",
    acl: "public-read",
    key: function (req, file, cb) {
      //파일이름 설정
      let ext = path.extname(file.originalname); // 파일의 확장자
      let randomName = uuidv4(file.originalname); //파일이름을 랜덤하게 부여
      cb(null, randomName + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb로 용량 제한
});

async function applyFeed(req, res) {
  const { content } = req.body;
  //로컬로 변경해야함
  const { user_Id } = req.body;
  console.log(req.file.location);
  if (!req.file) return res.status(400).json({ message: "이미지를 넣어주세요" }); //이미지 없을때

  try {
    await feed.create({ content, user_Id, feedImg: req.file.location }); //피드 생성
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

async function updateFeed(req, res) {
  //게시글작성자와 수정하려는 자를 확인할 코드 필요
  const { content } = req.body;
  const { feed_Id } = req.params;
  const checkFeedId = await feed.findOne({ where: { id: feed_Id } }); //피드가 있는지 체크
  if (!checkFeedId) return res.status(400).json({ messeage: "해당 피드가 존재하지 않습니다." });
  try {
    await feed.update({ content, feedImg: `feedImg/${req.file.filename}` }, { where: { id: feed_Id } }); //피드 수정
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

async function deletFeed(req, res) {
  //게시글작성자와 삭제하려는 자를 확인할 코드 필요
  const { feed_Id } = req.params;
  const checkFeedId = await feed.findOne({ where: { id: feed_Id } });
  if (!checkFeedId) return res.status(400).json({ messeage: "해당 피드가 존재하지 않습니다." }); //안해주면 피드가 없어서 삭제는 안되지만 성공으로 들어감 이유는?
  try {
    await feed.destroy({ where: { id: feed_Id } }); //피드삭제
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

async function likeFeed(req, res) {
  const { feed_Id } = req.params; //어떤 피드에 좋아요
  const { likeId } = req.body; //좋아요를 누른 유저 로컬에서 받는 코드 추가해야함
  try {
    const userlike = await userBasic.findOne({ where: { userId: likeId } }); //좋아요 누른 유저 찾기
    await feedLike.create({ feed_Id, likeId, user_Id: userlike.id }); //좋아요 누른 피드 ,유저 추가
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

async function unlikeFeed(req, res) {
  const { feed_Id } = req.params;
  const { unlikeId } = req.body; //좋아요 취소를 누른 유저 로컬에서 받는 코드 추가해야함
  const checkFeedId = await feed.findOne({ where: { id: feed_Id } }); //피드 체크
  const userUnlike = await userBasic.findOne({ where: { userId: unlikeId } }); //유저체크
  try {
    if (!checkFeedId) return res.status(400).json({ messeage: "해당 피드가 존재하지 않습니다." });
    if (!userUnlike) return res.status(400).json({ messeage: "좋아요를 누른 유저가 아닙니다." });
    await feedLike.destroy({
      //피드와 취소를 누른 유저의 좋아요데이터 삭제
      where: {
        feed_Id,
        user_Id: userUnlike.id,
      },
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
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
};
