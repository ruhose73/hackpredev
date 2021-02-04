const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    header: {type: String, required:true,unique: true},
    body: {type: String, required:true},
    date: {type: Date, default: Date.now},  //дата создания поста
    owner: {type: Types.ObjectId, ref: 'User'}  //создатель поста
})

module.exports = model('Post', schema)
