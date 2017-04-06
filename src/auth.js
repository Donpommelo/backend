const express = require('express')
const bodyParser = require('body-parser')

const login = (req, res) => {
    res.send({username: req.body.username, result:'success'})
} 

const register = (req, res) => {
    res.send({username: req.body.username, result:'success'})
} 

const logout = (req, res) => {
    res.send('OK')
} 

module.exports = app => {
    app.post('/login', login)
    app.post('/register', register)
    app.put('/logout', logout)
}


