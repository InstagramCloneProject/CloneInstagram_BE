const router = require("express").Router();
const userController = require("../controller/user");
const joimiddleware = require('../middlewares/joi')
const authmiddleware = require('../middlewares/auth')
// router.get("/", bbbController);
router.post("/join", joimiddleware, userController.join);
router.post('/login', userController.login);
router.post("/:user_Id/follow", authmiddleware, userController.follow)
router.delete("/:user_Id/follow", userController.unfollow)
// router.delete("/:user_Id/profileImg", userController.addprofileImg)
// router.patch("/", bbbController);
// router.delete("/", bbbController);

module.exports = router;
