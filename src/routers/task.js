const express = require('express')
const Task = require('../models/task.js')
const auth = require('../middleware/auth.js')

const router = new express.Router()

// Create Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Get Tasks
router.get('/tasks', auth, async (req, res) => {

    try {
        await req.user.populate('tasks')
        
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send("Task fetch error")
    }
})

// Get Task by Id
router.get('/tasks/:id', auth, async (req, res) => {

    try {
        task = await Task.findOne({_id:req.params.id, user: req.user._id})
        if (!task) {
            return res.status(404).send("404: Task not found")
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Update Task
router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['description', 'completed']
    valid = updates.every((update) => allowed_updates.includes(update))

    if (!valid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        task = await Task.findOne({_id: req.params.id, user: req.user._id})

        if (!task) {
            return res.status(404).send("404: Task not found")
        }

        updates.forEach((update) => task[update] = req.body[update])
        console.log(task)
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete Task
router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        task = await Task.findOneAndDelete({_id: req.params.id, user: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router