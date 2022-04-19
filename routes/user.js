const router = require("express").Router();
const userController = require("../controller/user");
const joimiddleware = require('../middlewares/joi')
const authmiddleware = require('../middlewares/auth')
// router.get("/", bbbController);
router.post("/join", joimiddleware, userController.join);
router.post('/login', userController.login);

router.get("/:user_Id", authmiddleware, userController.showMyPage);
router.post("/:user_Id/follow", authmiddleware, userController.follow)

router.delete("/:user_Id/follow", authmiddleware, userController.unfollow)
router.post('/:user_Id/profileImg', authmiddleware, userController.upload.single('image'), userController.applyProfileImg)
router.patch('/:user_Id/profileImg', authmiddleware, userController.upload.single('image'), userController.updateProfileImg)
router.delete('/:user_Id/profileImg', authmiddleware, userController.deleteProfileImg)
// router.delete("/:user_Id/profileImg", userController.addprofileImg)
// router.patch("/", bbbController);
// router.delete("/", bbbController);

module.exports = router;
