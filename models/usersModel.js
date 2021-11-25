const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({ 
    usertype: {
        type: String,
        enum: ['customer', 'landlord'],
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model(
    'User', 
    usersSchema
)
