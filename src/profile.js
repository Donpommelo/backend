const headlines = {user1: "headline 1", user2: "headline 2"}
const emails = {user1: "user1@rice.edu", user2: "user2@rice.edu"}
const dobs = {user1: "1-1-1991", user2: "2-2-1992"}
const zipcodes = {user1: "11111", user2: "22222"}
const avatars = {
    user1: "https://upload.wikimedia.org/wikipedia/commons/7/78/JRC-117_Rapid_Sakuma_Rail_Park_200907.jpg",
    user2: "https://upload.wikimedia.org/wikipedia/commons/6/62/983_Oslo._Utsikt_fra_Ekebergrestauranten_-_no-nb_digifoto_20151102_00016_bldsa_PK11910.jpg"}


const putHeadline = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    headlines[req.user] = req.body["headline"] ? req.body["headline"] : 'default headline'
    res.send({username: req.user, headline: headlines[req.user] })
}

const getHeadline = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const user = req.params.user ? req.params.user : req.user
    res.send({username: user, headline: headlines[user] ? headlines[user] : headlines[req.user]})
}

const getHeadlines = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const users = req.params.users ? req.params.users.split(',') : [req.user]
    res.send({ headlines: users.map((user) => 
        ({username: user, headline: headlines[user] ? headlines[user] : headlines[req.user]})
    )})
}

const getEmails = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const user = req.params.user ? req.params.user : req.user
    res.send({username: user, email: emails[user] ? emails[user] : emails[req.user]})
}

const putEmails = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    emails[req.user] = req.body["email"] ? req.body["email"] : 'default email'
    res.send({username: req.user, email: emails[req.user]})
}

const getDateofBirth = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    res.send({username: req.user, dob: req.body["dob"]})
}

const getZipcodes = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const user = req.params.user ? req.params.user : req.user
    res.send({username: user, zipcode: zipcodes[user] ? zipcodes[user] : zipcodes[req.user]})
}

const putZipcodes = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    zipcodes[req.user] = req.body["zipcode"] ? req.body["zipcode"] : 'default zipcode'
    res.send({username: req.user, zipcode: zipcodes[req.user]})
}

const getAvatars = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    const users = req.params.users ? req.params.users.split(',') : [req.user]
    res.send({ avatars: users.map((user) => 
        ({username: user, avatar: avatars[user] ? avatars[user] : avatars[req.user]})
    )})
}

const putAvatars = (req, res) => {
    if (!req.user) {
        req.user = 'user1'
    }
    avatars[req.user] = req.body["avatar"] ? req.body["avatar"] : 'default avatar'
    res.send({username: req.user, avatar: avatars[req.user]})
}

module.exports = app => {
    app.put('/headline', putHeadline)
    app.get('/headline', getHeadline)
    app.get('/headlines/:users?', getHeadlines)
    app.get('/email/:user?', getEmails)
    app.put('/email', putEmails)
    app.get('/dob', getDateofBirth)
    app.get('/zipcode/:user?', getZipcodes)
    app.put('/zipcode', putZipcodes)
    app.get('/avatars/:users?', getAvatars)
    app.put('/avatar', putAvatars)
}