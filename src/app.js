//SET UP BACK-END
const express = require('express')
require('./db/mongoose')

const { ObjectID } = require('bson')
const { updateOne } = require('./models/user')
const userRouter = require('./routers/users-router')
const gistRouter = require('./routers/gists-router')
const jwt = require('jsonwebtoken')

const app = express()

const port = process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(gistRouter)


//SET UP FRONT-END
const hbs = require('hbs')
//Define paths for express config
const viewPath = path.join(__dirname, '../templates/views')
const publicDirPath = path.join(__dirname, '../public')

//set up handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewPath)

//set up static directory to serve
app.use(express.static(publicDirPath))

app.listen(port, () => {
    console.log("Server is up on port " + port)
})

