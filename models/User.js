//programmed by Mikhail Toropchinov 2020


const {Schema, model, Types} = require('mongoose')

const schema = new Schema({

    email: {type: String, required:true, unique: true},    //почта
    firstName:String,   //  +   имя
    lastName:String,    //  +   фамилия
    login: {type: String, required:true, unique: true},  //логин
    mobile: String, //  +   телефон обновляется позже
    socialProfiles: [{twitter: String}, {facebook: String}, {vk: String}, {instagram: String}], //сетки
    avatarPath:String, //путь до аватарки (ссылка на хостинг или локал ХД)
    password: {type: String, required: true},   //  +   пароль
    accountCreated: {type: Date, default: Date.now},    //  +   дата создания
    likes: {type: Types.ObjectId, ref: 'Likes'},  //кто поставил лайки
    quant_likes : Number, //кол-во лайков

    posts: [{type: Types.ObjectId, ref: 'Post'}]    //ссылка на будущую схиму с постами

})

module.exports = model('User', schema)
