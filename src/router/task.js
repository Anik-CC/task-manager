const express = require('express')
const router = express.Router()
const Task = require('../database/task')
const path = require('path')
var hbs = require('hbs');

router.get('/',(req,res)=>{
    res.send('Hi this is node js')
    
})

router.post('/task',async(req,res)=>{
    const task = await new Task(req.body)
    try {
        await task.save()
        res.status(200).send(task)

    } catch (error) {
        res.status(400).send(error)
    }
   
   task.save().then((result)=>{
       console.log(result)
       res.status(200).send()
       res.send({result})
   }).catch(()=>{
       res.status(404);
      })
})

router.get('/task',async(req,res)=>{
    try {
        const tasks = await Task.find({})
       
        res.status(200).send(tasks)
    
    } catch (error) {
        res.send(error)
    }
    
})

router.get('/task/:id',async(req,res)=>{
    const taskID = req.params.id;
    try {
        const task = await Task.findById(taskID)
        res.status(200).send(task)
        
    } catch (error) {
        const err = {
            description:"404 not found",
            reason: "The ID searched was not found in Database",
            searchedID: taskID
        }
        res.status(400).send(err)
    }
})


router.patch('/task/:id',async(req,res)=>{
    const taskID = req.params.id;
    const updates = Object.keys(req.body);
    const allowUpdate = ['description','completed'];
    const isValidOperation = updates.every((update)=>allowUpdate.includes(update))
    

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Operations"})
    }
    try {
        const task = await Task.findById(taskID)
        res.send(task)
        updates.forEach(update => {
           task[update] =  req.body[update]
        });
       
        //const task = await Task.findByIdAndUpdate(taskID,req.body,{new:true, runValidators:true})
        await task.save()
        if(!task){
            return res.status(404)
        }

        
    } catch (error) {
        res.status(403).send(error)
    }
})

router.delete("/task/:id",async(req,res)=>{
    const taskID = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(taskID)
        if(!task){
            return res.sendStatus(404).send({"error":"Not found the task regarding ID "+taskID})
        }
        res.send(task)
    } catch (error) {
        res.sendStatus(404).send(error)
    }
})


module.exports = router