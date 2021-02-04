//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const Post = require('../models/Post')
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
            console.log(decodedToken.userId)
            const candidateHeader = await Post.findOne({header})
            if (candidateHeader) {
                return res.status(400).json({message: 'Такой заголовок уже существует'})
            }
            const user = new Post({user:decodedToken.userId, header, body})
            await user.save()

            res.status(201).json({message: 'Пост создан'})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })


module.exports = router
