const express = require('express')
// const router = express.Router()
const Task = require('../database/task')
const path = require('path')
var hbs = require('hbs');
const swal =require('sweetalert');


const app =express();

app.set('view engine','hbs')
app.use(express.static(path.join(__dirname,'../../templates/assets')))
app.use(express.urlencoded({
    extended: true
  }))
app.set("views",path.join(__dirname,'../../templates/views'))
// register path to partials
hbs.registerPartials(path.join(__dirname,'../../templates/partials'));





hbs.registerHelper("inc",(value, options)=>{
    return parseInt(value) +1
})

hbs.registerHelper("logic",(value, options)=>{
    return (value == false ?'Not Done' : 'Done')
})

hbs.registerHelper("selected",(value,option)=>{
   return (value == option ? 'selected' : '')
})


app.get('/',(req,res)=>{
    

    res.redirect('/task?view=1')

    
})


app.get('/task',async(req,res)=>{
    

    try {
        const tasks = await Task.find({})
        //res.send(tasks) 
        //return false
       
        res.status(200).render('index',{
            tasks,
            swal
        })
    
    } catch (error) {
        res.send(error)
    }
    
})

app.get('/addTask',async(req,res)=>{
    
    res.render('addTask')
    
    
})


app.post('/task',async(req,res)=>{

    const task = await new Task(req.body)
    try {
        await task.save()
        res.status(200).redirect('/task?view=1')

    } catch (error) {
        res.status(400).send(error)
    }

})

app.get("/deletTask/:id",async(req,res)=>{
    const taskID = req.params.id;
    //res.send(taskID)
    try {
        const task = await Task.findByIdAndDelete(taskID)
        
        if(!task){
            return res.sendStatus(404).send({"error":"Not found the task regarding ID "+taskID})
        }
        swal({
            title: "Deleted!",
            text: "The Task has been Deleted!",
            icon: "warning",
            dangerMode: true,
          })
        
        res.redirect('/task?view=1&res=del')
    } catch (error) {
        res.sendStatus(404).send(error)
    }
})


app.get('/updateTask/:id',async(req,res)=>{
    const taskID = req.params.id;
    try {
        const task = await Task.findById(taskID)
        res.status(200).render('updateTask',{
            task
        })
        
    } catch (error) {
        const err = {
            description:"404 not found",
            reason: "The ID searched was not found in Database",
            searchedID: taskID
        }
        res.status(400).send(err)
    }
})


app.post('/updateTask/:id',async(req,res)=>{
    const taskID = req.params.id;
    const updates = Object.keys(req.body);
    

    const allowUpdate = ['description','completed'];
    const isValidOperation = updates.every((update)=>allowUpdate.includes(update))
    

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Operations"})
    }
    try {
        const task = await Task.findByIdAndUpdate(taskID,req.body,{new:true, runValidators:true})
        if(!task){
            return res.status(404)
        }

        res.redirect('/task?view=1')
    } catch (error) {
        res.status(403).send(error)
    }
})










module.exports = app