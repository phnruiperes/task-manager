const express = require('express')
const Task = require('../models/task.js')

const router = new express.Router()

// Create Task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Get Tasks
router.get('/tasks', async (req, res) => {

    try {
        tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Get Task by Id
router.get('/tasks/:id', async (req, res) => {

    try {
        task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send("404: Task not found")
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Update Task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['description', 'completed']
    valid = updates.every((update) => allowed_updates.includes(update))

    if (!valid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send("404: Task not found")
        }
        
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete Task
router.delete('/tasks/:id',async (req,res)=>{
    try{
        task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router