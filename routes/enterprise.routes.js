//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
//const Post = require('../models/Post')
//const User = require('../models/User')
//const Likes = require('../models/Likes')
const Interprise = require('../models/enterprise')
const router = Router()


//создание поста
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

            const interprise = new Interprise({user:decodedToken.userId, title, content,author: decodedToken.userId})
            await interprise.save()

            const interprise_id = interprise.id
            res.status(201).json({interprise_id})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })
