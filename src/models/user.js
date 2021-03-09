const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Gist = require('./gist')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password must not contain 'password'")
            }
        },
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//set up virtual attributes to fetch all Gists for a current user
userSchema.virtual('myGist', {
    ref: 'Gist',
    localField: '_id',
    foreignField: 'owner',
})

//Create Authentification Token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ '_id': user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//make sure return values for user doesn't contain tokens and password
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password

    return userObject
}

//find user by email and password to log them in and authenticate
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Unable to log in")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to log in")
    }

    return user
}

// hash the plain-text password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete all the gists when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Gist.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)


module.exports = User