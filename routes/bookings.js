// Script for creating, editing and deleting bookings

const express = require('express')
const authorize = require('../middleware/authorize')
const mongoose = require('mongoose')
const router = express.Router()
const Booking = require('../models/bookingsModel')
router.use(authorize)

router.get('/', authorize, async (req, res) => {
    try {
        const bookings = await Booking.find().exec()
        res.send(bookings)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        if(req.authUser.usertype == "customer") {
            const booking = new Booking({
                _id: new mongoose.Types.ObjectId(),
                cabin: req.body.cabin,
                from: req.body.from,
                to: req.body.to,
                userID: req.authUser.sub
            })

            const cabinID = await Booking.find({cabin: req.body.cabin}).exec()
            
            const newFromDate = new Date(req.body.from);
            const newToDate = new Date(req.body.to);
            
            cabinIsFree = true
            
            for(let i = 0; i < cabinID.length; i++){

                const cabinToDate = new Date(cabinID[i].to)
                const cabinFromDate = new Date(cabinID[i].from)

                if(newFromDate < cabinToDate && newToDate > cabinFromDate) {
                    console.log("This cabin is already booked.")
                    cabinIsFree = false
                    break
                }
            }
            if(cabinIsFree) {
                console.log("Thank you for your booking")
                const newBooking = await booking.save()
                res.status(201).send(newBooking)
            }
        } else {
            console.log("You are a landlord, please register as a customer to make a booking")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getBookingById = async (req, res, next) => {
    const booking = await Booking.findOne({ _id: req.params.id, userID: req.authUser.sub }).exec() 
    if (!booking) return res.status(404).json({message: 'Booking not found'})
    req.booking = booking
    next()
}

router.get('/:id', getBookingById, async (req, res) => {
    try {
        res.send(req.booking)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/:id', getBookingById, async (req, res) => {
    try {
        if(req.authUser.usertype == "customer") {

            const cabinID = await Booking.find({}).exec()
           
            const newFromDate = new Date(req.body.from);
            const newToDate = new Date(req.body.to);
            
            cabinIsFree = true
            
            for(let i = 0; i < cabinID.length; i++){
                
                const cabinToDate = new Date(cabinID[i].to)
                const cabinFromDate = new Date(cabinID[i].from)
                
                if(newFromDate != "Invalid Date" && newToDate != "Invalid Date") {
                    if(newFromDate < cabinToDate && newToDate > cabinFromDate) {
                        console.log("This cabin is already booked.")
                        cabinIsFree = false
                        break
                    }
                } else if(newFromDate != "Invalid Date") {
                    
                    if(newFromDate > cabinFromDate && newFromDate < cabinToDate) {
                        console.log("This cabin is already booked.")
                        cabinIsFree = false
                        break
                    }
                } else if(newToDate != "Invalid Date") {
                    if(newToDate > cabinFromDate && newToDate < cabinToDate) {
                        if(JSON.stringify(cabinID[i]._id) != JSON.stringify(req.booking._id)) {
                            console.log("This cabin is already booked.")
                            cabinIsFree = false
                            break
                        }
                    }
                }
                else {
                    console.log("No dates were put up for change")
                    break
                }
            }

            if(cabinIsFree) {
                const updatedBooking = await req.booking.updateOne(req.body).exec()
                res.json({message: "Booking updated!", modified: updatedBooking.modifiedCount})
            }
        } else {
            console.log("you are a landlord, you can't change a customers booking")
        }

    } catch (error) {
        res.status(500).send(error.message)
    }

})

router.delete('/:id', getBookingById, async (req, res) => {
    try {
        if(req.authUser.usertype == "customer") {
            const deleteBooking = await Booking.deleteOne(req.booking).exec()
            res.json({message: "Booking deleted!", deleted: deleteBooking.deletedCount})
        } else {
            console.log("you are a landlord, you can't delete a customers booking")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})



module.exports = router
