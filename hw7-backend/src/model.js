const mongoose = require('mongoose')
require('./db.js')

const commentSchema = new mongoose.Schema({
	commentId: String,
    author: String, 
    date: Date, 
    text: String
})

const articleSchema = new mongoose.Schema({
    author: String, 
    img: String, 
    date: Date, 
    text: String,
	comments: [ commentSchema ]
})

const userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String
})

const profileSchema = new mongoose.Schema({
    username: String,
    headline: String,
    following: [ String ],
    email: String,
    zipcode: String,
    dob: Date,
    avatar: String
})

exports.Comment = mongoose.model('comment', commentSchema)
exports.Article = mongoose.model('article', articleSchema)
exports.User = mongoose.model('user', userSchema)
exports.Profile = mongoose.model('profile', profileSchema)
