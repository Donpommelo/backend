
const Profile = require('./model.js').Profile

const getFollowing = (req, res) => {

    const desiredUsername = req.params.user ? req.params.user : req.body.username

    Profile.findOne({ username: desiredUsername }).exec(function(err, foundUser) {
        sendFollows(res, foundUser)         
    })
}

const putFollowing = (req, res) => {

    const follower = req.params.user

    //Follow target must exist
    Profile.findOne({ username: follower }).exec(function(err, foundFollower) {
        if (foundFollower) {
            //Follow Target must not already be followed
            Profile.findOneAndUpdate({ username: req.body.username }, {$addToSet: {following: follower}}, {new: true})
            .exec(function(err, foundUser) {
                sendFollows(res, foundUser)          
            })
    } else {
        res.sendStatus(404)
    }})
}

const deleteFollowing = (req, res) => {

    const follower = req.params.user

    Profile.findOneAndUpdate({ username: req.body.username }, {$pull: {following: follower}}, {new: true})
    .exec(function(err, foundUser) {
        sendFollows(res, foundUser)         
    })
}

const sendFollows = (res, follow) => {
    if (follow) {
        res.send({username: follow.username, following: follow.following})
    } else {
        res.sendStatus(404)
    }  
}

module.exports = app => {
    app.get('/following/:user?', getFollowing)
    app.put('/following/:user', putFollowing)
    app.delete('/following/:user', deleteFollowing)
}