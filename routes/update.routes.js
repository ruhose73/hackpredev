//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Likes = require('../models/Likes')
const router = Router()

//обновить или добавить мобильный телефон
router.post(
    '/education',
    async (req, res)=> {
        try{

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные'
                })
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            console.log(req.body)
            const {access_token,school, university} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const userSchool = await User.findByIdAndUpdate(decodedToken.userId, {educationSchool:{school:school}}, {new:true})
            await userSchool.save()
            const userUniversity = await User.findByIdAndUpdate(decodedToken.userId, {educationUniversity:{university:university}}, {new:true})
            await userUniversity.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Смена номера'})
        }
    }
)

//Добавить или обновить ФИО, пол возраст
router.post(
    '/maininfo',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token,firstname,lastname,sex, age, mobile} = req.body
            console.log(req.body)

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'))
            const user = await User.findByIdAndUpdate(decodedToken.userId, {firstName:firstname, lastName:lastname,sex: sex, age: age, mobile:mobile}, {new:true})
            await user.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Смена номера'})
        }
    }
)


router.get('/userinfo', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        console.log(req.headers)
        const {access_token} = req.headers
        console.log(access_token)
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
        console.log(decodedToken)

        const users = await User.find({})
        res.status(201).json({users})

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})


//лайк пользователя
router.post(
    '/likeuser',
    async (req, res) => {
        try {
            console.log(req.body)
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            const {access_token, user_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));

            const like = new Likes({owner:decodedToken.userId, user: user_id })
            await like.save()
            res.status(201).json({message: 'Вы поставили лайк пользователю!!!'})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Лайк пользователя'})
        }
    })


module.exports = router
