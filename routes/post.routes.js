//programmed by Mikhail Toropchinov 2020

const {Router} = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const Post = require('../models/Post')
const User = require('../models/User')
const Likes = require('../models/Likes')
const Interprise = require('../models/enterprise')
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

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token, header, body} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const candidateHeader = await Post.findOne({header})
            if (candidateHeader) {
                return res.status(400).json({message: 'Такой заголовок уже существует'})
            }

            //создание поста в таблице Post
            const post = new Post({user:decodedToken.userId, header, body,owner: decodedToken.userId})
            post.save()

            //Запись о посте в таблице User
            const userpost = await User.findByIdAndUpdate(decodedToken.userId, {$push:{posts:post._id}})
            //const userpost = await User.findByIdAndUpdate(decodedToken.userId, {posts:post._id}, {new:true})
            userpost.save()
            //const nulllike = await Post.findByIdAndUpdate(post_id, {posts:post_id, quant_likes: 0 }, {new:true})
            res.status(201).json({post_id})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Создание поста'})
        }
    })

router.post(
    '/createpostbyinterprise',
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

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token, header, body, interprise_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const candidateHeader = await Post.findOne({header})
            if (candidateHeader) {
                return res.status(400).json({message: 'Такой заголовок уже существует'})
            }

            const post = new Post({user:decodedToken.userId, header, body,owner: decodedToken.userId, interprise:interprise_id})
            await post.save()

            const userpost = await User.findByIdAndUpdate(decodedToken.userId, {$push:{posts:post._id}})
            const interprise = await Interprise.findByIdAndUpdate(interprise_id, {$push:{posts:post._id}})
            //const userpost1 = await User.findByIdAndUpdate(decodedToken.userId, {posts:post._id}, {new:true})
            await userpost.save()
            await interprise.save()
            //const nulllike = await Post.findByIdAndUpdate(post_id, {posts:post_id, quant_likes: 0 }, {new:true})
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

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

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
router.get('/', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

        const {access_token} = req.headers
        console.log(access_token)
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
        console.log(decodedToken)
        const posts = await Post.find({})
        res.status(201).json({posts})

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})



//поменять на ГЕТ
//получить все посты
// router.post(
//     '/',
//     async (req, res)=> {
//         try{
//             res.setHeader('Access-Control-Allow-Origin', '*');
//             res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
//             console.log(req.body)
//             const {access_token} = req.body
//             const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
//             const posts = await Post.find({})
//             res.status(201).json({posts})
//         }
//         catch (e)
//         {
//             res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
//         }
//     }
// )


//получить все СВОИ посты
router.get('/allposts', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

        const {access_token} = req.headers
        console.log(access_token)
        const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
        console.log(decodedToken)

        const posts = await Post.find({ owner:decodedToken.userId })
        res.status(200).json({posts})

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

//поменять на ГЕТ
//получить все СВОИ посты
// router.post(
//     '/allposts',
//     async (req, res)=> {
//         try{
//             const {access_token} = req.body
//             const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
//             const posts = await Post.find({ owner:decodedToken.userId })
//
//             res.status(201).json({posts})
//         }
//         catch (e)
//         {
//             res.status(500).json({message: 'Ошибка сервера. Обновление поста'})
//         }
//     }
// )

//получить все посты другого пользователя
router.post(
    '/alluserposts',
    async (req, res)=> {
        try{

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');


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

//получить все посты инициативы
router.post(
    '/getfroment',
    async (req, res)=> {
        try{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            console.log(req.body)
            const {access_token, interprise_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const posts = await Post.find( {interprise:interprise_id} )
            res.status(201).json({posts})
        }
        catch (e)
        {
            res.status(500).json({message: 'Ошибка сервера. Получение постов инициативы'})
        }
    }
)

//поставить лайк посту
router.post(
    '/likepost',
    async (req, res) => {
        try {
            console.log(req.body)

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            const {access_token, post_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));

            const like = new Likes({owner:decodedToken.userId, post: post_id })
            await like.save()
            const likes = await Post.findById(post_id)
            console.log(likes)
            let qlikes = likes.quant_likes+1
            console.log(qlikes)
            const post = await Post.findByIdAndUpdate(post_id, {quant_likes:qlikes}, {new:true})
            res.status(201).json({qlikes})

        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Лайк поста'})
        }
    })


router.post(
    '/onepost',
    async (req, res) => {
        try {
            console.log(req.body)
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            const {access_token, post_id} = req.body
            const decodedToken = jwt.verify(access_token, config.get('jwtSecret'));
            const onepost = await Post.findById(post_id)
            console.log(onepost)
            res.status(201).json({onepost})
        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера. Лайк поста'})
        }
    })




module.exports = router
