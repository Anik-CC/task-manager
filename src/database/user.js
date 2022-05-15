const mongoose = require("./mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({

}, { strict: false })

/* taskSchema.pre('save', function (next) {
    const task = this
    console.log('this is middleware', this)
    next()
}) */

const User = mongoose.model('User', userSchema);




module.exports = User;