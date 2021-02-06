//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
//const Post = require('../models/Post')
const User = require('../models/User')
const Likes = require('../models/Likes')
const Interprise = require('../models/enterprise')
const router = Router()



//вступить в команду в инициативе
router.post(
    '/intoteaminterprise',

    async (req, res) => {
        try {
            const {access_token, interprise_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const team = await Interprise.findByIdAndUpdate(interprise_id, {$push:{team:decodedToken.userId}})
            const userproject = await User.findByIdAndUpdate(decodedToken.userId, {$push:{projects:interprise_id}})
            await userproject.save()
            await team.save()
            res.status(201).json({interprise_id})
        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })


//стать подписчиком инициативы
router.post(
    '/intoteaminterprise',

    async (req, res) => {
        try {
            const {access_token, interprise_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const team = await Interprise.findByIdAndUpdate(interprise_id, {$push:{user:decodedToken.userId}})
            await team.save()
            res.status(201).json({interprise_id})
        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })


//создание инициативы
router.post(
    '/createinterpise',
    [
        check('title', 'заголовок не должен быть пустым').exists(),
        check('content', 'Тело не должно быть пустым').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            console.log(req.body)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные'
                })
            }

            const {access_token, title, content} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));

            const candidateHeader = await Interprise.findOne({title})
            if (candidateHeader) {
                return res.status(400).json({message: 'Такой заголовок уже существует'})
            }

            const interprise = new Interprise({user:decodedToken.userId, team:decodedToken.userId, title, content,author: decodedToken.userId, quant_likes: 0})
            await interprise.save()
            const interprise_id = interprise.id
            res.status(201).json({interprise_id})



        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })


//обновление инициативы
router.post(
    '/interpisestages',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            console.log(req.body)
            const {access_token,interprise_id,stage1, stage2,stage3,stage4,stage5} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const stage = await Interprise.findByIdAndUpdate(interprise_id,{stage1:stage1, stage2:stage2, stage3:stage3, stage4:stage4, stage5:stage5})
            await stage.save()

            res.status(201).json({message:"Стейджи созданы"})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)


//получить все инициативы
router.get('/allinterpises', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

        const {access_token} = req.headers
        console.log(access_token)
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
        console.log(decodedToken)

        const interprises = await Interprise.find({})
        res.status(201).json({interprises})

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})


//получить СВОЮ инициативу
router.get('/myinterpise', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

        const {access_token} = req.headers
        console.log(access_token)
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
        console.log(decodedToken)
        const interprises = await Interprise.find({author:decodedToken.userId })
        res.status(201).json({interprises})


    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

//получить все инициативы другого пользователя
router.post(
    '/alluserinterpises',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            console.log(req.body)
            const {access_token, user_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const interprises = await Interprise.find({ author:user_id })

            res.status(201).json({interprises})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)

//получить все инициативы другого пользователя
router.post(
    '/getbyid',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            console.log(req.body)
            const {access_token, interprise_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const interprises = await Interprise.findById({interprise_id})
            res.status(201).json({interprises})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)


module.exports = router
