//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Likes = require('../models/Likes')
const router = Router()

//обновить или добавить школу, универ, специализацию
router.post(
    '/educationandspecialization',
    async (req, res)=> {
        try{

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
			
			const {access_token} = req.headers
            const {school, university, specialization} = req.body
			console.log(req.body);

            const {access_token,school, university, specialization,job} = req.body

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const userSchool = await User.findByIdAndUpdate(decodedToken.userId, {school:school}, {new:true})
            await userSchool.save()
            const userUniversity = await User.findByIdAndUpdate(decodedToken.userId, {university:university}, {new:true})
            await userUniversity.save()
            const userSpecialization = await User.findByIdAndUpdate(decodedToken.userId, {specialization:specialization}, {new:true})
            await userSpecialization.save()
            const userjob = await User.findByIdAndUpdate(decodedToken.userId, {job:job}, {new:true})
            await userjob.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json(e)

            res.status(500).json({message: 'Ошибка сервера. Специализация'})

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

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'))
            const user = await User.findByIdAndUpdate(decodedToken.userId, {firstName:firstname, lastName:lastname,sex: sex, age: age, mobile:mobile}, {new:true})
            await user.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Основная информация'})
        }
    }
)

//Добавить или обновить графу о себе
router.post(
    '/aboutme',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token,aboutme} = req.body

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'))
            const about = await User.findByIdAndUpdate(decodedToken.userId, {aboutme:aboutme}, {new:true})
            await about.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Графа о себе'})
        }
    }
)

//Добавить или обновить соцсети
router.post(
    '/socials',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token,twitter,facebook,vk,instagram} = req.body

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'))
            const social = await User.findByIdAndUpdate(decodedToken.userId, {twitter:twitter,facebook:facebook,vk:vk,instagram:instagram}, {new:true})
            await social.save()
            res.status(201).json({message: 'Пользователь обновлен'})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Соцсети'})
        }
    }
)

//получить всех пользователей
router.get('/alluser', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        const {access_token} = req.headers
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));

        const users = await User.find({})
        res.status(201).json({users})

    } catch (e) {
        res.status(500).json({ message: 'Ошибка сервера. Загрузка всех пользователей' })
    }
})

//загрузить свою информацию
router.get('/userinfo', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')
        const {access_token} = req.headers
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
        const user_id = decodedToken.userId
        const user = await User.findById(user_id)
        res.status(201).json({user})

    } catch (e) {
        res.status(500).json({ message: 'Ошибка сервера. Загрузка своей информации' })
    }
})

//Получить всех пользователей
router.post(
    '/alluserinfo',
    async (req, res) => {
        try {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            const {access_token, user_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const user = await User.findById(user_id)
            res.status(201).json({user})
        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Получение всех пользователей'})
        }
    })



//лайк пользователя
router.post(
    '/likeuser',
    async (req, res) => {
        try {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token, user_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const like = new Likes({owner:decodedToken.userId, user: user_id })
            await like.save()
            const Like = await User.findById(user_id)
            console.log(Like.quant_likes)
            qlikes = Like.quant_likes+1
            console.log(qlikes)
            const NewLike = await User.findByIdAndUpdate(user_id, {quant_likes:qlikes},{new:true})
            NewLike.save()
            res.status(201).json({message: 'Вы поставили лайк пользователю!!!'})
        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Лайк пользователя'})
        }
    })

module.exports = router
