const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
require('./src/articles')(app)
require('./src/auth')(app)
require('./src/following')(app)
require('./src/profile')(app)

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})