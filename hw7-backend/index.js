const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

/*const env = require('node-env-file')
env(__dirname + '/.env')

if (process.env.NODE_ENV !== "production") {
    require('dotenv').load()
}*/
const enableCors = (req, res, next) => {

    res.set('Access-Control-Allow-Origin', req.headers.origin)
    res.set('Access-Control-Allow-Credentials', true)
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type, Origin, X-Requested-With')
    if(req.method === 'OPTIONS'){
        res.sendStatus(200)
    }
    next()
}

const app = express()
app.use(enableCors)
app.use(bodyParser.json())
app.use(cookieParser())

require('./src/auth')(app)
require('./src/articles')(app)
require('./src/following')(app)
require('./src/profile')(app)

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})