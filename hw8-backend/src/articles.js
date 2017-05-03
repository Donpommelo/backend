const Article = require('./model.js').Article
const Comment = require('./model.js').Comment
const Profile = require('./model.js').Profile
const ObjectId = require('mongodb').ObjectId

const md5 = require('md5')
const uploadImage = require('../uploadCloudinary')

const numVisibleArticles = 10

const getArticles = (req, res) => {
    
    if (req.params.id) {
        const desiredArticles = req.params.id.split(',')
        
        //If id is provided, check to see if it is a valid objectId, then match author and/or _id
        if (ObjectId.isValid(desiredArticles[0])) {
            Article.find({$or: [{_id: ObjectId(desiredArticles[0])}, {author: {$in: desiredArticles}}]})
            .exec(function(err, foundArticles) {
                sendArticles(res, foundArticles) 
            })
        } else {
            //Not a valid _id. Only check if authors match.
            Article.find({author: {$in: desiredArticles}}).exec(function(err, foundArticles) {
                sendArticles(res, foundArticles)
            })
        }        
    } else {
        getVisibleArticles(req, res)
    }
}

//No id provided. Return 10 articles whose authors are followed by user.
const getVisibleArticles = (req, res) => {
    Profile.findOne({ username: req.body.username }).exec(function(err, foundUser) {
        const followList = foundUser.following
        Article.find({$or: [{author: {$in: followList}},{author: req.body.username}]}).sort({date: -1}).limit(numVisibleArticles)
        .exec(function(err, foundArticles) {
            sendArticles(res, foundArticles)
        })    
    })
}

const putArticles = (req, res) => {

    if (req.body.commentId) {
        if (req.body.commentId === -1) {

            //Writing a new comment with proper text, author.
            const newComment = createComment(req.body.username, req.body.text)

            Article.findOneAndUpdate({_id: ObjectId(req.params.id)}, {$push: {comments: newComment}}, {new: true})
            .exec(function(err, foundArticle) {
                sendArticles(res, foundArticle)      
            })
        } else {

            //Editing comment. Article must exist and contain a comment that matches the input id and is written by user
            
            Article.findOne({$and: [{_id: ObjectId(req.params.id)}, {comments: {$elemMatch: {commentId: req.body.commentId}}}]},
            {'comments.$.author': 1}).exec(function(err, foundArticle) {
                if (!foundArticle) {
                    res.sendStatus(404)
                    return
                }
                if (foundArticle.comments[0].author !== req.body.username) {
                    res.sendStatus(404)
                    return
                }
                Article.findOneAndUpdate({$and: [{_id: ObjectId(req.params.id)},
                {comments: {$elemMatch: {commentId: req.body.commentId}}}]}, 
                {$set: {'comments.$.text': req.body.text}}, {new: true})
                .exec(function(err, foundUserArticle) {
                    sendArticles(res, foundUserArticle)      
                })
            })
        }
    } else {

        //Editing the text of an article that matches the input id and is written by user.
        Article.findOneAndUpdate({$and: [{_id: ObjectId(req.params.id)}, {author: req.body.username}]}, 
        {$set: {text: req.body.text}}, {new: true})
        .exec(function(err, foundArticle) {
            sendArticles(res, foundArticle)      
        })
    }
}

const postArticle = (req, res) => {

    //If req.body has an author/comment field (loading from initDatabase), we use those fields.
    const newArticle = {
        author: req.body.author ? req.body.author : req.body.username,
        img: req.fileurl ? req.fileurl : "",
        date: new Date(),
        text: req.body.text,
        comments: req.body.comments ? req.body.comments : []
    }

    const newMongoArticle = new Article(newArticle)
    newMongoArticle.save()
    res.send({articles: [newMongoArticle]})
}

const sendArticles = (res, article) => {
    if (article) {
        res.send({articles: article})
    } else {
        res.sendStatus(404)
    }  
}

const createComment = (author, text) => {
    const newDate = new Date();
    const newComment = {
        author: author,
        date: newDate,
        text: text,
        commentId: md5(`${author}${newDate}`)
    }

    const newMongocomment = new Comment(newComment)
    return newMongocomment
}

module.exports = app => {
    app.get('/articles/:id*?', getArticles)
    app.put('/articles/:id', putArticles)
    app.post('/article', uploadImage('article'), postArticle)
}