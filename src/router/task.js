const express = require('express')
const router = express.Router()
const Task = require('../database/task')
const auth = require('../middleware/auth')
const path = require('path')
var hbs = require('hbs');

router.get('/',(req,res)=>{
    res.send('Hi this is node js')
    
})

router.post('/task',auth,async(req,res)=>{
    const ID = req.user._id.toString()
    
    const task = await new Task({
        ...req.body,
        owner: req.user._id
    })
   
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

// GET /task?completed=false
// Pagination GET/task?limit=10&skip=20
//Sorting -1 is for descending and 1 for ascending for any field createdAt:desc
router.get('/task',auth,async(req,res)=>{
    const  match = {}
    const sort = {}
        if(req.query.completed){
            
            match.completed = req.query.completed === 'true'
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            console.log(parts)
            sort[parts[0]] = (parts[1] === 'desc' ? -1 : 1) 
        }
        console.log(match)
    
    try {

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    completed:-1
                }
            }
        })
        const tasks = req.user.tasks
        //console.log(tasks.toObject({ virtuals: true }))
        
        
        if(!tasks){
            return res.status(404).send({error:"No task found by your ID "+req.user._id})
        }
       
        res.status(200).send(tasks)
    
    } catch (error) {
        res.send(error)
    }
    
})

router.get('/task/:id',auth ,async(req,res)=>{
    const _id = req.params.id;
   // console.log({ _id, owner: req.user._id })
    try {
        // const task = await Task.findById(taskID)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send({error:"You have not created any task or wrong task ID"})
        }
        res.status(200).send(task)
        
    } catch (error) {
        const err = {
            description:"404 not found",
            reason: "The ID searched was not found in Database",
            searchedID: _id
        }
        res.status(400).send(err)
    }
})


router.patch('/task/:id',auth,async(req,res)=>{
    const taskID = req.params.id;
    const updates = Object.keys(req.body);
    const allowUpdate = ['description','completed'];
    const isValidOperation = updates.every((update)=>allowUpdate.includes(update))
    

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Operations"})
    }

    try {
        
        const task = await Task.findOne({_id: taskID, owner: req.user._id })
        // const task = await Task.findById(taskID)
        console.log(task)
       
        //const task = await Task.findByIdAndUpdate(taskID,req.body,{new:true, runValidators:true})
        
        if(!task){
            return res.status(404).send({error:"Cannot update this task"})
        }
        
        updates.forEach(update => {
           task[update] =  req.body[update]
        });
        await task.save()
        res.send(task)
        
    } catch (error) {
        console.log(error)
        res.status(403).send(error)
    }
})

router.delete("/task/:id",auth,async(req,res)=>{
    const taskID = req.params.id;

    try {
        const task = await Task.findOneAndDelete({_id:taskID, owner:req.user._id})
        if(!task){
            return res.status(404).send({error:"Not found the task regarding ID "})
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router