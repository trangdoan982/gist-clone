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

app.listen(port, () => {
    console.log("Server is up on port " + port)
})
