// access, refresh 모두 유효
// refresh만 유효
// access만 유효
// access, refresh 모두 만료

// 사용자 인증 미들웨어
const { userBasic } = require('../models/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = async (req, res, next) => {
    const { authorization } = req.headers
    const [tokenType, tokenValue] = authorization.split(' ') // access token
    // token type 검증 
    if (tokenType != 'Bearer') {
        console.log('토큰타입에러 발생')
        res.status(401).send({
            errorMessaage: '로그인 후 사용하세요.'
        })
        return
    }

    const accessTokenValue = checkExpired(tokenValue) // access token verify 값
    console.log('accesstoken:' + accessTokenValue)
    // access 만료
    if (accessTokenValue === 'jwt expired') {
        console.log('access토큰 만료')
        const valueInToken = jwt.decode(tokenValue)
        const userRefreshToken = await userBasic.findOne({ where: { userId: valueInToken.userId } }).then((value) => {
            try {
                return checkExpired(value.refreshToken)
            } catch (err) {
                return 'jwt expired'
            }
        })
        // 1. access 만료 + refresh 유효 => access 재발급
        if (userRefreshToken !== 'jwt expired') {
            console.log('stage1: access 만료 + refresh 유효')
            const userRefreshToken = await userBasic.findOne({ where: { userId: valueInToken.userId } }).then((value) => { return value.refreshToken })
            await userBasic.findOne({ where: { refreshToken: userRefreshToken } }).then((value) => {
                const accessToken = jwt.sign({ userId: value.userId, nickName: value.nickName }, process.env.SECRET_KEY, { expiresIn: '300s' })
                res.status(200).json({ accessToken })
            })
        } else {
            // 2. access + refresh 모두 만료
            console.log('stage2: access 만료 + refresh 만료')
            res.status(400).json({ errormsg: '모든 토큰 만료' })
            return
        }
    } else {
        // access 유효
        console.log('access 토큰 유효')
        const userRefreshToken = await userBasic.findOne({ where: { userId: accessTokenValue.userId } }).then((value) => {
            try {
                return value.refreshToken
            } catch (err) {
                return 'jwt expired'
            }
        })
        // 3. access 유효 + refresh 만료 => refresh 발급
        if (userRefreshToken === 'jwt expired') {
            console.log('stage3: access 만료 + refresh 유효')
            await userBasic.update({ refreshToken }, { where: { userId: accessTokenValue.userId } })
        }
        try {
            // 4. access 유효 + refresh 유효 => user 정보 보내주기.
            console.log('stage4: access 유효 + refresh 유효')
            const user = await userBasic.findOne({ where: { userId: accessTokenValue.userId } }).then((value) => { return value.dataValues.userId })
            res.locals.user = user
            next()
        }
        // access 변조
        catch (error) {
            console.log('???')
            res.status(401).json({
                errorMessage: '로그인 후 사용하세요.'
            })
            return
        }
    }
}
// 토큰 verify function
function checkExpired(tokenValue) {
    try {
        return jwt.verify(tokenValue, process.env.SECRET_KEY)
    } catch (err) {
        return 'jwt expired'
    }
}