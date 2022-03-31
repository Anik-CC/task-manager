const mongoose = require("./mongoose")
const bcrypt = require("bcryptjs")

const taskSchema =  new mongoose.Schema({
    description:{
        type:String,
        required: true,
    },
    completed:{
        type:Boolean,
        default:false
    }
})

taskSchema.pre('save',function(next){
    const task = this
    console.log('this is middleware', this)
    next()
})

const Task = mongoose.model('Task',taskSchema);




module.exports = Task;