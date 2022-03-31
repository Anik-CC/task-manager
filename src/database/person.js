const mongoose = require("./mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,    
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is Invalid, please add a Valid Email")
            }
        }
    },  
    age:{
        type:Number,
        default:false,
        validate(value){
            if(value<1){
                throw new Error('Age must be greater than 1')
            }
        }
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

// Generating Token

userSchema.methods.generateAuthToken = async function(){
const user = this
const token = jwt.sign({_id:user._id.toString()},'signIn')
console.log(user)
user.tokens = user.tokens.concat({ token })
 
await user.save()
return token
}

//Users schema

userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await Person.findOne({email})


    if(!user){
        throw new Error("No user found, Unable to Login!")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        
        throw new Error("Please insert a valid Password")
    }
    return user

    
}

//Hash the plain text password for saving
userSchema.pre('save',async function(next){
    const user = this
    //console.log(user.isModified('password'))
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const Person = mongoose.model('Person', userSchema);


module.exports = Person;