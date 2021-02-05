//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const Post = require('../models/Post')
const User = require('../models/User')
const router = Router()


//создание поста
router.post(
    '/createpost',
    [
        check('header', 'заголовок не должен быть пустым').exists(),
        check('body', 'Тело не должно быть пустым').exists()
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

            const {access_token, header, body} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const candidateHeader = await Post.findOne({header})
            if (candidateHeader) {
                return res.status(400).json({message: 'Такой заголовок уже существует'})
            }

            const post = new Post({user:decodedToken.userId, header, body,owner: decodedToken.userId})
            await post.save()

            const userpost = await User.findByIdAndUpdate(decodedToken.userId, {posts:post.id}, {new:true})
            await userpost.save()
            const post_id = post.id
            res.status(201).json({post_id})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })


//обновление поста
router.post(
    '/postupdate',
    [
        check('header', 'заголовок не должен быть пустым').exists(),
        check('body', 'Тело не должно быть пустым').exists()
    ],
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
            const {access_token,post_id, header, body} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const post = await Post.findOneAndUpdate({_id:post_id, owner:decodedToken.userId}, {header:header, body:body}, {new:true})
            await post.save()

            res.status(201).json({post_id})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)


//получить все посты
router.post(
    '/',
    async (req, res)=> {
        try{
            console.log(req.body)
            const {access_token} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const posts = await Post.find({})

            res.status(201).json({posts})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)

//поменять на ГЕТ
//получить все СВОИ посты
router.post(
    '/allposts',
    async (req, res)=> {
        try{
            console.log(req.body)
            const {access_token} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const posts = await Post.find({ owner:decodedToken.userId })

            res.status(201).json({posts})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)

//получить все посты другого пользователя
router.post(
    '/alluserposts',
    async (req, res)=> {
        try{
            console.log(req.body)
            const {access_token, user_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const posts = await Post.find({ owner:user_id })

            res.status(201).json({posts})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
        }
    }
)


module.exports = router
