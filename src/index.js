const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const index = express();

const port = process.env.PORT


const router = require('../src/router/task')
const person = require('../src/router/person')


const gui = require('../src/router/gui')


index.use(express.json())

/*Middleware added to control the login authentication*/

index.use((req, res, next)=>{
    if(req.query.view !=1){
      
      index.use(router)//using the using API-
      next()
    }else{
        index.use(gui)//using the gui
        next() 
    }
    
})

/*Middleware ends here  */


index.use(person)//using the person-API


module.exports = index
