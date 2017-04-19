const uploadImage = require('../uploadCloudinary')
const Profile = require('./model.js').Profile

const putHeadline = (req, res) => {
    Profile.update({username: req.body.username}, {$set: {headline: req.body.headline}})
    .then(res.send({ username: req.body.username, headline: req.body.headline}))
}

const getHeadline = (req, res) => {

    const desiredUsername = req.params.user ? req.params.user : req.body.username

    Profile.findOne({ username: desiredUsername }).exec(function(err, foundUser) {
        if (foundUser) {
            res.send({username: foundUser.username, headline: foundUser.headline})  
        } else {
            res.sendStatus(404)
        }
    })
}

const getHeadlines = (req, res) => {

    const desiredUsers = req.params.users ? req.params.users.split(',') : [req.body.username]

    Profile.find({username: {$in: desiredUsers}}).exec(function(err, foundUsers) {
        if (foundUsers) {
            res.send({headlines: foundUsers.map((user) => {
                return {username : user.username, headline: user.headline}
            })})
        } else {
            res.sendStatus(404)
        }  
    })
}

const getEmails = (req, res) => {

    const desiredUsername = req.params.user ? req.params.user : req.body.username

    Profile.findOne({ username: desiredUsername }).exec(function(err, foundUser) {
        if (foundUser) {
            res.send({username: foundUser.username, email: foundUser.email})
        } else {
            res.sendStatus(404)
        }
    })
}

const putEmails = (req, res) => {
    Profile.update({username: req.body.username}, {$set: {email: req.body.email}})
    .then(res.send({ username: req.body.username, email: req.body.email}))
}

const getDateofBirth = (req, res) => {

    const desiredUsername = req.params.user ? req.params.user : req.body.username

    Profile.findOne({ username: desiredUsername }).exec(function(err, foundUser) {
        if (foundUser) {
            res.send({username: foundUser.username, dob: foundUser.dob})
        } else {
            res.sendStatus(404)
        }
    })
}

const getZipcodes = (req, res) => {

    const desiredUsername = req.params.user ? req.params.user : req.body.username

    Profile.findOne({ username: desiredUsername }).exec(function(err, foundUser) {
        if (foundUser) {
            res.send({username: foundUser.username, zipcode: foundUser.zipcode})
        } else {
            res.sendStatus(404)       
        }
    })
}

const putZipcodes = (req, res) => {
    Profile.update({username: req.body.username}, {$set: {zipcode: req.body.zipcode}})
    .then(res.send({ username: req.body.username, zipcode: req.body.zipcode}))
}

const getAvatars = (req, res) => {

    const desiredUsers = req.params.users ? req.params.users.split(',') : [req.body.username]

    Profile.find({username: {$in: desiredUsers}}).exec(function(err, foundUsers) {
        if (foundUsers) {
            res.send({avatars: foundUsers.map((user) => {
                return {username : user.username, avatar: user.avatar}
            })})
        } else {
            res.sendStatus(404)
        }  
    })
}

const putAvatars = (req, res) => {
    Profile.update({username: req.body.username}, {$set: {avatar: req.fileurl}})
    .then(res.send({ username: req.body.username, avatar: req.fileurl}))
}

module.exports = app => {
    app.put('/headline', putHeadline)
    app.get('/headline', getHeadline)
    app.get('/headlines/:users*?', getHeadlines)
    app.get('/email/:user?', getEmails)
    app.put('/email', putEmails)
    app.get('/dob', getDateofBirth)
    app.get('/zipcode/:user?', getZipcodes)
    app.put('/zipcode', putZipcodes)
    app.get('/avatars/:users*?', getAvatars)
    app.put('/avatar', uploadImage('avatar'), putAvatars)
}