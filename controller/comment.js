const { comment } = require("../models/index");

async function applyComment(req, res) {
  const { content } = req.body;
  const { user_Id, feed_Id } = req.body;

  await comment.create({ content, user_Id, feed_Id });

  res.json({ success: true });
}

module.exports = {
  applyComment,
};
