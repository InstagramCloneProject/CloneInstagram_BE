// access, refresh 모두 유효
// refresh만 유효
// access만 유효
// access, refresh 모두 만료

// 사용자 인증 미들웨어
const { userBasic, userInfo } = require('../models/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.satus(401).json({
                result: false,
                message: '로그인 후 사용하세요',
                reason: '헤더에 토큰이 없어요'
            })
        }
        const { authorization } = req.headers
        const [tokenType, tokenValue] = authorization.split(' ') // access token
        if (tokenType != 'Bearer') {
            console.log('토큰타입에러 발생')
            res.status(401).send({
                message: '로그인 후 사용하세요.'
            })
            return
        }
        const authedToken = jwt.verify(tokenValue, process.env.SECRET_KEY)
        const user = await userBasic.findOne({ where: { userId: authedToken.userId } })
        const userInfo = await userInfo.findOne({ where: { user_Id: authedToken.user_Id } })
        res.locals.id = user.id
        res.locals.userId = user.userId
        res.locals.nickName = user.nickName
        res.locals.profileImg = userInfo.profileImg
        next()
    } catch (err) {
        try {
            if (err.name === 'TokenExpiredError') {
                const reAuthorization = req.headers.reauthorization
                const [tokenType, tokenValue] = reAuthorization.split(' ')
                if (tokenType !== 'Bearer') {
                    return res.status(401).json({
                        result: false,
                        message: '로그인 후 사용하세요',
                        reason: '리프레쉬 토큰이 Bearer가 아니에요'
                    })
                }
                // const accessToken = jwt.sign({
                // userId: user.userId,
                // nickName: user.nickName }, process.env.SECRET_KEY, { expiresIn: '30s' })
                const authedToken = jwt.verify(tokenValue, process.env.SECRET_KEY)
                const user = await userBasic.findOne({ where: { userId: authedToken.userId } })
                const profileImg = await userInfo.findOne({ where: { user_Id: user.id } })
                const newAccessToken = jwt.sign({
                    userId: user.userId,
                    nickName: user.nickNaME,
                    profileImg: profileImg.profileImg
                }, process.env.SECRET_KEY, { expiresIn: '60s' })
                res.status(401).json({
                    result: true,
                    atoken: newAccessToken,
                })
            }
            else {
                res.status(401).json({
                    result: false,
                    message: '다시 로그인하셔야 합니다',
                    reason: 'access토큰에 문제가 있네요(기한만료가 아닌 에러)',
                    err
                })
            }
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).send({
                    result: false,
                    message: '다시 로그인하셔야 합니다',
                    reason: '리프레쉬 토큰까지 만료됐어요',
                    err
                })
            } else {
                console.log(err)
                res.status(401).json({
                    result: false,
                    message: '다시 로그인하셔야 합니다',
                    reason: '리프레쉬 토큰에 문제가 있네요(기한만료가 아닌 에러)',
                    err
                })
            }

        }
    }
}




