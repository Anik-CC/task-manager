const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express();

const port = process.env.PORT


const router = require('../src/router/task')
const person = require('../src/router/person')


const gui = require('../src/router/gui')


app.use(express.json())

/*Middleware added to control the login authentication*/

app.use((req, res, next)=>{
    if(req.query.view !=1){
      
      app.use(router)//using the using API-
      next()
    }else{
        app.use(gui)//using the gui
        next() 
    }
    
})

/*Middleware ends here  */


app.use(person)//using the person-API








app.listen(port,()=>{
    console.log("port is running on "+port)
})

const Task = require("./database/task")
const User = require("./database/person")


const main = async()=>{
/* const task = await Task.findById('626057c0b7a177df425f8278')
await task.populate(['owner']) */

const user = await User.findById('622f8c7d3a84b85e34e6876f')
await user.populate('tasks')
console.log(user.toObject({ virtuals: true }))//this is used to show the virtuals
}
//main()


const myFunction =  async()=>{
    const password = 'Anik1234'
    const hashPassword = await bcrypt.hash(password,8)
    //console.log(hashPassword)

    const isMatch = await bcrypt.compare(password,hashPassword)
   // console.log(isMatch)
    
}

const logintest = async()=>{
    const token = jwt.sign({_id:'anik@134'},'thisIsNew')
    console.log(token)

    const data = jwt.verify(token,'thisIsNew')
   //console.log(data)
}

const pet = {
    name:"mei"
}

pet.toJSON = function(){
    
    return this
}

//console.log(JSON.stringify(pet))

//ogintest()
//myFunction()

