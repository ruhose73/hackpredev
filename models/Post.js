const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    user: {type: String, required:true},    //создатель поста
    header: {type: String, required:true,unique: true},
    body: {type: String, required:true},
    date: {type: Date, default: Date.now},  //дата создания поста
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Post', schema)
