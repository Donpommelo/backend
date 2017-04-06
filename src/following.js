const followings = {user1: ["user2", "user3"], user2: ["user2", "user3"], user3: ["user1", "user2"]}

const getFollowing = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const user = req.params.user ? req.params.user : [req.user]
    res.send({username: user, following: followings[user] ? followings[user] : followings[req.user]})
}

const putFollowing = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const follower = req.params.user ? req.params.user : [req.user]
    res.send({username: req.user, following: followings[req.user].push(follower)})
}

const deleteFollowing = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const follower = req.params.user ? req.params.user : [req.user]
    res.send({username: req.user, following: followings[req.user].filter((f) => f != follower)})
}

module.exports = app => {
    app.get('/following/:user?', getFollowing)
    app.put('/following/:user', putFollowing)
    app.delete('/following/:user', deleteFollowing)
}