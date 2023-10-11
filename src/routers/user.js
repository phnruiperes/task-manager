const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')

const router = new express.Router()

// Create User
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// User Login
router.post('/users/login', async (req, res) => {
    try {
        user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// User Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send(req.user.tokens)
    } catch (e) {
        res.status(500).send()
    }
})

// User Logout All
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send(req.user.tokens)
    } catch (e) {
        res.status(500).send()
    }
})

// Get Current User
router.get('/users/me', auth, async (req, res) => {

    try {
        
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// Get User by Id
router.get('/users/:id', async (req, res) => {

    try {
        user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send("404: User not found")
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// Update User
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['name', 'age', 'email', 'password']
    valid = updates.every((update) => allowed_updates.includes(update))

    if (!valid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete User
router.delete('/users/me', async (req, res) => {
    try {
        await req.user.remove()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// DEV: User List
router.post('/users/list', auth, async (req, res) => {
    try {
        if (req.user.dev) {
            list = await User.find({})
            res.status(200).send(list)
        } else {
            res.status(403).send("Access denied")
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router