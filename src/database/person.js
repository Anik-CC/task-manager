const mongoose = require("./mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is Invalid, please add a Valid Email")
            }
        }
    },
    age: {
        type: Number,
        default: false,
        validate(value) {
            if (value < 1) {
                throw new Error('Age must be greater than 1')
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
/* Here we are setting the local and foreign keys as localfield is the id of the user and foreign field is the owner field of the task schema */
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
/*************************** Ends here storing of the virtual reference ********************************/

// Creating a user profile after successfull login

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Generating Token

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({ token })

    await user.save()
    return token
}

//Users schema

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await Person.findOne({ email })


    if (!user) {
        throw new Error("No user found, Unable to Login!")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {

        throw new Error("Please insert a valid Password")
    }
    return user


}

//Hash the plain text password for saving
userSchema.pre('save', async function (next) {
    const user = this
    //console.log(user.isModified('password'))
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


// Delete the user tasks when user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })

    next()
})


const Person = mongoose.model('Person', userSchema);


module.exports = Person;