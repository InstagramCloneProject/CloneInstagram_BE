var DataTypes = require("sequelize").DataTypes;
var _comment = require("./comment");
var _commentLike = require("./commentLike");
var _feed = require("./feed");
var _feedLike = require("./feedLike");
var _recomment = require("./recomment");
var _recommentLike = require("./recommentLike");
var _userBasic = require("./userBasic");
var _userFollow = require("./userFollow");
var _userInfo = require("./userInfo");

function initModels(sequelize) {
  var comment = _comment(sequelize, DataTypes);
  var commentLike = _commentLike(sequelize, DataTypes);
  var feed = _feed(sequelize, DataTypes);
  var feedLike = _feedLike(sequelize, DataTypes);
  var recomment = _recomment(sequelize, DataTypes);
  var recommentLike = _recommentLike(sequelize, DataTypes);
  var userBasic = _userBasic(sequelize, DataTypes);
  var userFollow = _userFollow(sequelize, DataTypes);
  var userInfo = _userInfo(sequelize, DataTypes);

  commentLike.belongsTo(comment, { as: "comment", foreignKey: "comment_Id" });
  comment.hasMany(commentLike, { as: "commentLikes", foreignKey: "comment_Id" });
  recomment.belongsTo(comment, { as: "comment", foreignKey: "comment_Id" });
  comment.hasMany(recomment, { as: "recomments", foreignKey: "comment_Id" });
  comment.belongsTo(feed, { as: "feed", foreignKey: "feed_Id" });
  feed.hasMany(comment, { as: "comments", foreignKey: "feed_Id" });
  feedLike.belongsTo(feed, { as: "feed", foreignKey: "feed_Id" });
  feed.hasMany(feedLike, { as: "feedLikes", foreignKey: "feed_Id" });
  recommentLike.belongsTo(recomment, { as: "recomment", foreignKey: "recomment_Id" });
  recomment.hasMany(recommentLike, { as: "recommentLikes", foreignKey: "recomment_Id" });
  comment.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(comment, { as: "comments", foreignKey: "user_Id" });
  commentLike.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(commentLike, { as: "commentLikes", foreignKey: "user_Id" });
  feed.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(feed, { as: "feeds", foreignKey: "user_Id" });
  feedLike.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(feedLike, { as: "feedLikes", foreignKey: "user_Id" });
  recomment.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(recomment, { as: "recomments", foreignKey: "user_Id" });
  recommentLike.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(recommentLike, { as: "recommentLikes", foreignKey: "user_Id" });
  userFollow.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(userFollow, { as: "userFollows", foreignKey: "user_Id" });
  userInfo.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(userInfo, { as: "userInfos", foreignKey: "user_Id" });

  return {
    comment,
    commentLike,
    feed,
    feedLike,
    recomment,
    recommentLike,
    userBasic,
    userFollow,
    userInfo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
