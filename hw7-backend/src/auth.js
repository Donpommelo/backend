const User = require('./model.js').User
const Profile = require('./model.js').Profile

const md5 = require('md5')

const express = require('express')

//const redis = require('redis').createClient(process.env.REDIS_URL)

const sessions = {}
const cookieKey = "sid"
const hashCode = "aycarambas"
app = express();

const login = (req, res) => {
    if(!req.body.username){
        res.sendStatus(400)
        return
    }

    if(!req.body.password){
        res.sendStatus(400)
        return
    }
    User.findOne({ username: req.body.username }).exec(function(err, userObj) {
        if (userObj) {
            if (!userObj.salt || !userObj.hash) {
                res.sendStatus(401)
                return
            }

            if(newHash(req.body.password, userObj.salt) !== userObj.hash) {
                res.sendStatus(401)
                return
            }

            const currentDate = new Date()
            const sid = `${hashCode}${req.body.password}${userObj.salt}${currentDate}`

            sessions[sid] = userObj.username

//            redis.hmset(sid, userObj)

            res.cookie(cookieKey, `${sid}`, { maxAge: 3600*1000, httpOnly: true })

            res.send({result: "success", username: req.body.username})
        } else {
            res.sendStatus(404)
        }
    })    
}

const logout = (req, res) => {
    delete sessions[req.cookies[cookieKey]]
    res.cookie(cookieKey, "", { httpOnly: true })
    res.send("OK")
}

const register = (req, res) => {
    const newsalt = newSalt(req.body.username)
    const newhash = newHash(req.body.password, newsalt)

    const newProfile = {
        username: req.body.username,
        headline: 'Default Starting Headline.',
        email: req.body.email,
        dob: req.body.dob,
        zipcode: req.body.zipcode,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/78/JRC-117_Rapid_Sakuma_Rail_Park_200907.jpg'
    }

    const newUser = {
        username: req.body.username,
        salt: newsalt,
        hash: newhash
    }

    new Profile(newProfile).save()
    new User(newUser).save()

    res.send({result: "success", username: req.body.username})
}

const password = (req, res) => {
    User.findOne({ username: req.body.username }).exec(function(err, foundUser) {
        if (foundUser) {
            const newhash = newHash(req.body.password, foundUser.salt)
            User.findOneAndUpdate({ username: req.body.username }, {$set: {hash: newhash}}, {new: true})
            .exec(function(err, foundUser) {
                if (foundUser) {
                    res.send({result: "success", username: req.body.username})
                } else {
                    res.sendStatus(404)
                }          
            })
        } else {
            res.sendStatus(404)
        }
    })
}

//Called by frontend upon refreshing page to keep a logged in user at the main page.
const refresh = (req, res) => {
    const sid = req.cookies[cookieKey]

    if (!sid) {
         return
    }
    
    const username = sessions[sid]

    if (!username) {
        return
    }

    res.send({isLoggedin:true, username: username})
}

const isLoggedin = (req, res, next) => {
    const sid = req.cookies[cookieKey]

    if (!sid) {
         return res.sendStatus(401)
    }
    
    const username = sessions[sid]

    if (!username) {
        return res.sendStatus(400)
    }
    req.body.username = username
    next()
}

const hello = (req, res) => {
    res.send('hello world')
}

const index = (req, res) => {
    res.send('temp text')
}

const newHash = (password, salt) => {
    return md5(`${hashCode}${password}${salt}`)
}

const newSalt = (username) => {
    const randInt = Math.random() * 10000
    const currDate = new Date()
    return md5(`${username}${randInt}${currDate}`)
}

module.exports = (app) => {
    app.post('/login', login)
    app.put('/logout', isLoggedin, logout)
    app.post('/register', register)
    app.put('/password', isLoggedin, password)
    app.get('/refresh', refresh)
    app.get('', hello)
    app.put('/', index)
    app.use(isLoggedin)
}
