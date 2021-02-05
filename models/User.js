//programmed by Mikhail Toropchinov 2020


const {Schema, model, Types} = require('mongoose')

const schema = new Schema({

    email: {type: String, required:true, unique: true},    //   +   почта
    firstName:String,   //  +   имя
    lastName:String,    //  +   фамилия
    age: Number,    //  +    возраст
    sex: String,    //  +    пол
    login: {type: String, required:true, unique: true},  // +   логин
    mobile: String, //  +   телефон обновляется позже
    password: {type: String, required: true},   //  +   пароль

    school: String, //образование школа
    university: String, //образование универа
    faculty: String,    //факультет
    specialization:String,  //специализация

    aboutme: String,    //обо мне

    twitter: String,
    facebook: String,
    vk: String,
    instagram: String, //сетки

    avatarPath:String, //путь до аватарки (ссылка на хостинг или локал ХД)

    accountCreated: {type: Date, default: Date.now},    //  +   дата создания
    posts: [{type: Types.ObjectId, ref: 'Post'}], //ссылка на схиму с постами
    projects: [{type: Types.ObjectId,ref: 'Interprise'}],
    likes: [{type: Types.ObjectId, ref: 'Likes'}],  //кто поставил лайки
    quant_likes : Number //кол-во лайков


})

module.exports = model('User', schema)
