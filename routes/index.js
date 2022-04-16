const router = require("express").Router();

const user = require("./user");
const feed = require("./feed");
const comment = require("./comment");
const recomment = require("./recomment");

router.use("/user", user);
router.use("/feed", feed);
router.use("/comment", comment);
router.use("/recomment", recomment);

module.exports = router;
