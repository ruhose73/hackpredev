//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

router.post(
    '/numberupdate',
    [check('mobile', 'Минимальная длина номера 10 символов').isLength({min:10})],
    async (req, res)=> {
        try{

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные'
                })
            }
            console.log(req.body)
            const {access_token,mobile} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const user = await User.findByIdAndUpdate(decodedToken.userId, {mobile:mobile}, {new:true})
            await user.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Смена номера'})
        }
    }
)

router.post(
    '/nameupdate',
    async (req, res)=> {
        try{
            const {access_token,firstname,lastname} = req.body
            console.log(req.body)

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'))
            const user = await User.findByIdAndUpdate(decodedToken.userId, {firstName:firstname, lastName:lastname}, {new:true})
            await user.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Смена номера'})
        }
    }
)

module.exports = router
