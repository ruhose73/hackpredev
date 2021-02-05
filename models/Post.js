//programmed by Mikhail Toropchinov 2020


const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    header: {type: String, required:true,unique: true},
    body: {type: String, required:true},
    date: {type: Date, default: Date.now},  //дата создания поста
    owner: {type: Types.ObjectId, ref: 'User'} , //создатель поста
    likes: {type: Types.ObjectId, ref: 'Likes'},//кто поставил лайки
    quant_likes : Number //кол-во лайков
})

module.exports = model('Post', schema)
