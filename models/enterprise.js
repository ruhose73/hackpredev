//programmed by Mikhail Toropchinov 2020

const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    title: {type: String, required:true,unique: true}, //заголовок
    author: {type: Types.ObjectId, ref: 'User'} , //создатель инициативы
    content: {type: String, required:true}, //текст инициативы
    date: {type: Date, default: Date.now},  //дата создания инициативы
    team: [{type: Types.ObjectId, firstName:String, status:String, avatar:String, ref: 'Users'}],   //члены команды
    user: [{type: Types.ObjectId, firstName:String, status:String, avatar:String, ref: 'Users'}],   //обычные подписчики
    stages:[{state:Number}, {name: String}, {description: String}], //стэйты
    likes: {type: Types.ObjectId, ref: 'Likes'},//кто поставил лайки
    quant_likes : Number, //кол-во лайков
    posts: [{type: Types.ObjectId, header:String,  ref: 'Post'}]
})

module.exports = model('Interprise', schema)
