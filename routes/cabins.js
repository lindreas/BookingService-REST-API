// Script for creating, editing and deleting cabins

const express = require('express')
const authorize = require('../middleware/authorize')
const router = express.Router()
const Cabin = require('../models/cabinsModel')
router.use(authorize)

router.get('/', authorize, async (req, res) => {
    try {
        const cabins = await Cabin.find()
        res.send(cabins)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        if(req.authUser.usertype == "landlord") {
            const cabin = new Cabin({
                address: req.body.address,
                size: req.body.size,
                sauna: req.body.sauna,
                beach: req.body.beach,
                price: req.body.price,
                userID: req.authUser.sub
            })
            const newCabin = await cabin.save()
            res.status(201).send(newCabin)
        } else {
            console.log("You need to be a landlord to post cabins")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getCabinById = async (req, res, next) => {
    const cabin = await Cabin.findOne({ _id: req.params.id, userID: req.authUser.sub }).exec()
    if (!cabin) return res.status(404).json({message: 'Cabin not found'})
    req.cabin = cabin
    next()
}

router.get('/:id', getCabinById, async (req, res) => {
    try {
        res.send(req.cabin)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/:id', getCabinById, async (req, res) => {
    try {
        if(req.authUser.usertype == "landlord") {
            const updatedCabin = await req.cabin.updateOne(req.body).exec()
            res.json({message: "Cabin updated!", modified: updatedCabin.modifiedCount})
        } else {
            console.log("You must be a landlord to make changes")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/:id', getCabinById, async (req, res) => {
    try {
        if(req.authUser.usertype == "landlord") {
            const deletedCabin = await Cabin.deleteOne(req.body).exec()
            res.json({message: "Cabin deleted!", deleted: deletedCabin.deletedCount})
        } else {
            console.log("You must be a landlord to delete a cabin")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})



module.exports = router
