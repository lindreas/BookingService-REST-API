// Script for handling the creation and login of users

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')

router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email }).exec()
        if (!user) return res.status(400).json({message: "No such user"})

        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) {

            const jwtBody = {
                sub: user._id,
                email: user.email,
                usertype: user.usertype
            }

            const accessToken = await jwt.sign(
                jwtBody, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            )
            
            return res.status(201).send(accessToken)
            
        }
        res.status(201).send('failed')

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const user = new User({
            usertype: req.body.usertype,
            firstname: req.body.firstname,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword
        })

        const newUser = await user.save()
        res.status(201).send(newUser)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})




module.exports = router
