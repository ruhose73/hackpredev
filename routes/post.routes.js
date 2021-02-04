//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const Post = require('../models/Post')
const User = require('../models/User')
const router = Router()

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

            res.status(201).json({message: 'Пост создан'})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })

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

            const {access_token,post, header, body} = req.body

            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const user = await User.findByIdAndUpdate(decodedToken.userId, {header:header}, {new:true})
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
