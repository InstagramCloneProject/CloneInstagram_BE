var DataTypes = require("sequelize").DataTypes;
var _comment = require("./comment");
var _feed = require("./feed");
var _feedLike = require("./feedLike");
var _userBasic = require("./userBasic");
var _userFollow = require("./userFollow");
var _userInfo = require("./userInfo");

function initModels(sequelize) {
  var comment = _comment(sequelize, DataTypes);
  var feed = _feed(sequelize, DataTypes);
  var feedLike = _feedLike(sequelize, DataTypes);
  var userBasic = _userBasic(sequelize, DataTypes);
  var userFollow = _userFollow(sequelize, DataTypes);
  var userInfo = _userInfo(sequelize, DataTypes);

  comment.belongsTo(feed, { as: "feed", foreignKey: "feed_Id" });
  feed.hasMany(comment, { as: "comments", foreignKey: "feed_Id" });
  feedLike.belongsTo(feed, { as: "feed", foreignKey: "feed_Id" });
  feed.hasMany(feedLike, { as: "feedLikes", foreignKey: "feed_Id" });
  comment.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(comment, { as: "comments", foreignKey: "user_Id" });
  feed.belongsTo(userBasic, { as: "feed", foreignKey: "feed_Id" });
  userBasic.hasMany(feed, { as: "feeds", foreignKey: "feed_Id" });
  feedLike.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(feedLike, { as: "feedLikes", foreignKey: "user_Id" });
  userFollow.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(userFollow, { as: "userFollows", foreignKey: "user_Id" });
  userInfo.belongsTo(userBasic, { as: "user", foreignKey: "user_Id" });
  userBasic.hasMany(userInfo, { as: "userInfos", foreignKey: "user_Id" });

  return {
    comment,
    feed,
    feedLike,
    userBasic,
    userFollow,
    userInfo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
