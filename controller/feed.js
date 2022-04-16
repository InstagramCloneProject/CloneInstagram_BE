const { feed, userBasic, feedLike } = require("../models/index");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

async function showFeed(req, res) {}

//multer
try {
  fs.readdirSync("feedImg"); // 폴더 확인
} catch (err) {
  console.error("feedImg 폴더가 없습니다. 폴더를 생성합니다.");
  fs.mkdirSync("feedImg"); // 폴더 생성
}

const upload = multer({
  storage: multer.diskStorage({
    // 저장한공간 정보 : 하드디스크에 저장
    destination(req, file, done) {
      // 저장 위치
      done(null, "feedImg/"); // feedImg라는 폴더 안에 저장
    },
    filename(req, file, done) {
      // 파일명을 어떤 이름으로 올릴지
      let ext = path.extname(file.originalname); // 파일의 확장자
      let randomName = uuidv4(file.originalname); //파일이름을 랜덤하게 부여
      done(null, path.basename(randomName, ext) + ext); // 파일이름 + 확장자 이름으로 저장
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb로 용량 제한
});

async function applyFeed(req, res) {
  const { content } = req.body;
  //로컬로 변경해야함
  const { user_Id } = req.body;

  if (!req.file) return res.status(400).json({ message: "이미지를 넣어주세요" }); //이미지 없을때

  try {
    await feed.create({ content, user_Id, feedImg: `feedImg/${req.file.filename}` }); //피드 생성
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
