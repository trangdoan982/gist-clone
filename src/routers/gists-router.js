const express = require('express')
const router = new express.Router()
const Gist = require('../models/gist')
const auth = require('../middleware/auth')

//Create a new gist for logged in user
router.post('/gists', auth, async (req, res) => {
    const gist = new Gist({
        ...req.body,
        owner: req.user._id
    })

    try {
        await gist.save()
        res.status(201).send(gist)
    } catch (e) {
        res.status(400).send(e)
    }
    
})

//Get all gists for logged in user
router.get('/gists', auth, async (req, res) => {
    try{
        await user.populate('myGist').execPopulate()
        res.send(user.myGist)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Get all gists to populate the Discover view
router.get('/gists/all', async (req, res) => {
    try{
        const allGists = await Gist.find({})
        res.send(allGists)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Get a specific gist from an user with gist id
router.get('/gists/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const gist = await Gist.findOne({ _id, owner: req.user._id })
        if (!gist) {
            res.status(404).send()
        }

        res.send(gist)

    } catch {
        res.status(400).send()
    }
})

//update a gist with authentification
router.patch('/gists/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'content']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        res.status(404).send("Invalid update info")
    }

    try {
        const gist = await Gist.findOne({_id: req.params.id, owner: req.user._id})
        if (!gist) {
            return res.status(404).send()
        }

        updates.forEach((update) => gist[update] = req.body[update])
        await gist.save()
        
        res.send(gist)
    } catch (e) {
        res.status(400).send(e)
    }
    
})

//Delete a gist
router.delete('/gists/:id', auth, async (req, res) => {
    try {
        const gist = await gist.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        res.send(gist)
    } catch {
        res.status(500).send("can't perform gist deletion")
    }
})

module.exports = router