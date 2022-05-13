const express = require('express')
const router = express.Router()
const Person = require('../database/person')
const bcrypt = require("bcryptjs")
const auth = require('../middleware/auth')
const multer = require('multer')

const upload = multer({
    dest: "images"
})




router.get('/',(req,res)=>{
    res.send('Hi this is node js')
    
})

router.post('/person',async(req,res)=>{
    const person = await new Person(req.body)
    try {
        await person.save()
        const token = await person.generateAuthToken()
        res.status(200).send({person,token})

    } catch (error) {
        res.status(400).send(error)
    }
   
   person.save().then((result)=>{
       console.log(result)
       res.status(200).send()
       res.send({result})
   }).catch(()=>{
       res.status(404);
      })
})



router.get('/person',auth,async(req,res)=>{
    try {
        const person = await Person.find({})
       
        res.status(200).send(person)
    
    } catch (error) {
        res.send(error)
    }
    
})

router.post('/person/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
             return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send({msg:"You are Logged Out"})
     } catch (error) {
         res.send(400).send(error)
     }
    
})

router.post('/person/logoutAll',auth,async(req,res)=>{
    
    try {
        req.user.tokens = [];
        console.log(req.user)
        await req.user.save()
        res.status(200).send({msg:"You are Flushed Out all Tokens"})
     } catch (error) {
         res.send(400).send(error)
     }
    
})

router.get('/person/me',auth,async(req,res)=>{
    res.status(200).send(req.user)
    
})

router.get('/person/:id',async(req,res)=>{
    const personID = req.params.id;
    try {
        const task = await Task.findById(personID)
        res.status(200).send(person)
        
    } catch (error) {
        const err = {
            description:"404 not found",
            reason: "The ID searched was not found in Database",
            searchedID: personID
        }
        res.status(400).send(err)
    }
})


router.patch('/person/',auth,async(req,res)=>{
   
    const updates = Object.keys(req.body);
    const allowUpdate = ['name','email','age','password'];
    const isValidOperation = updates.every((update)=>allowUpdate.includes(update))
    

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Operations"})
    }
    try {
       
        updates.forEach((update)=>   req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(403).send(error)
    }
})

router.delete("/person/me",auth,async(req,res)=>{
    
    
    try {
       /*  const person = await Person.findByIdAndDelete(req.user.id)
        if(!person){
            return res.sendStatus(404).send({"error":"Not found the Person regarding ID "+req.user.id})
        } */
        await req.user.remove()
        res.send({'msg':"Success the person is deleted"});
    } catch (error) {
        res.sendStatus(404).send(error)
    }
})

router.post("/person/login",async(req,res)=>{
    try {
        const user = await Person.findByCredentials( req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        // res.send({user:user.getPublicProfile(), token})
        res.send({user, token})
    } catch (error) {
        console.log(error)
       res.send({error:"No user found please check the response"})
        
    }
})


router.post("/person/me/avatar", upload.single('avatar'), (req,res)=>{
    res.send("file uploaded")
})


module.exports = router