//programmed by Mikhail Toropchinov 2020


const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    owner: {type: Types.ObjectId, unique: true, ref: 'User'}, //челик который поставил лайк
    user: {type: Types.ObjectId, ref: 'User'}, //челик с лайками
    post: {type: Types.ObjectId, ref: 'Post'} , //пост с лайками
    interprise: {type: Types.ObjectId, ref: 'Interprise'}  //инициатива с лайками
})

module.exports = model('Likes', schema)
