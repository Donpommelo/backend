const User = require('./model.js').User
const Profile = require('./model.js').Profile
const Auth = require('./model.js').Auth
const express = require('express')
const FacebookStrategy = require('passport-facebook').Strategy
const md5 = require('md5')
const redis = require('redis').createClient(process.env.REDIS_URL)
const isLoggedIn = require('./auth').isLoggedIn


const cookieKey = "sid"
const hashCode = "aycarambas"

const url = "http://greedy-fruit.surge.sh"

app = express();

const login = (req, res) => {
    if (!req.session) {
        return res.status(404).redirect(url)
    } 
    if (!req.session.passport || !req.session.passport.user) {
        return res.status(404).redirect(url)
    }
    if (req.cookies.sid){
        const sid = req.cookies[cookieKey]
        if(!sid){
            res.status(401)
        }
        redis.hgetall(sid, (err, userObj) => {
            if (userObj) {
                User.findOne({username: userObj.username}, (err, user) => {
                    
                })
            } else {
                res.cookie(cookieKey, "", { httpOnly: true })
                res.status(401)
            }
        })
    } else {
        const currentDate = new Date()
        const sid = `${hashCode}${req.session.passport.user.username}${currentDate}`
        redis.hmset(sid, { username: req.session.passport.user.username })
        res.cookie(cookieKey, `${sid}`, { maxAge: 3600*1000, httpOnly: true })
    }
    return res.redirect(url)
}

const hello = (req, res) => {
    res.send('hello world')
}

const logout = (req, res) => {
    req.logout()
    req.redirect('/')
}

const linkAccounts = (req, res) => {
    User.findOne({ username: req.body.locusername }).exec(function(err, userObj) {
        if (userObj) {
            if (!userObj.salt || !userObj.hash) {
                res.sendStatus(401)
                return
            }

            if(newHash(req.body.locpassword, userObj.salt) !== userObj.hash) {
                res.sendStatus(401)
                return
            }

            const newAuth = {
                provider: "facebook",
                username: `${req.body.username}@facebook`
            }

            User.remove({ username: req.body.username }, (err) => {})
            Profile.remove({ username: req.body.username}, (err) => {})
            User.update({ username: req.body.locusername }, {$push: {auth: new Auth(newAuth)}})

            const currentDate = new Date()
            const sid = `${hashCode}${req.body.password}${userObj.salt}${currentDate}`

            redis.hmset(sid, userObj)

            res.cookie(cookieKey, `${sid}`, { maxAge: 3600*1000, httpOnly: true })

            res.send({result: "success", username: req.body.username})
        } else {
            res.sendStatus(404)
        }
    })  
}

const unlinkAccounts = (req, res) => {
    User.update({ username: req.body.username }, {$set: {auth: []}})
    res.send({result: "success", username: req.body.username})
}

const newHash = (password, salt) => {
    return md5(`${hashCode}${password}${salt}`)
}

module.exports = (app, passport) => {

    passport.serializeUser( (user, done) => {

        const username = `${user.displayName}@${user.provider}`
        User.findOne({ auth: { $elemMatch: { provider: user.provider, username: username }}} , (err, userObj) => {
        if (userObj) {
            User.findOne({ username: userObj.username }, (err, foundUser) => {
                done(null, foundUser)
            })
        } else {
            const newUser = {
                username: username,
                auth: [{ provider: user.provider, username: username }]
            }
            
            new User(newUser).save()

            const newProfile = {
                username: username
            }
            new Profile(newProfile).save()

            done(null, new User(newUser))
        }})
    })

    passport.deserializeUser( (user, done) => {
        User.findOne({ username: user }, (err, foundUser) => {
            if (err) {
                throw new Error(err)
            }
            done(null, foundUser)
        })
    })

    passport.use( new FacebookStrategy({
        clientID: '237475413393083',
        clientSecret: '4c3b7576763032d51186d8cc77fada0d',
        callbackURL: 'https://fathomless-scrubland-85774.herokuapp.com/auth/facebook/callback'
    }, (token, refreshToken, profile, done) => {
        process.nextTick( () => {
            return done(null, profile)
        })
    }))

    app.get('/', hello)
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }))
    app.get('/logout', isLoggedIn, logout)
    app.get('/auth/facebook/callback', passport.authenticate('facebook'), login)
    app.put('/link', isLoggedIn, linkAccounts)
    app.get('/unlink', isLoggedIn, unlinkAccounts)
}