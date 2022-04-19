// 사용자 인증 미들웨어
// 세팅
const joi = require('joi')

module.exports = (req, res, next) => {
    const { userId, nickName, password, confirmPassword } = req.body

    const joischema = joi.object({
        userId: joi.string().regex(new RegExp(/[a-zA-Z0-9@._-]/)).min(3).max(12).required(),
        nickName: joi.string().min(3).max(12).required(),
        password: joi.string().alphanum().min(4).max(12).required(),
    })
    // validation이 잘되면 next, 안되면 에러메시지 띄우고 리턴.
    joischema.validateAsync({ userId, nickName, password }).then((value) => {
        next()
    }).catch((error) => {
        res.status(400).send({ success: false, errormsg: '아이디, 닉네임, 패스워드를 확인해주세요.' })
        return
    })
}

