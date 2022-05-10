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
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Person'
    }
},{
    timestamps:true
})

taskSchema.pre('save',function(next){
    const task = this
    console.log('this is middleware', this)
    next()
})

const Task = mongoose.model('Task',taskSchema);




module.exports = Task;