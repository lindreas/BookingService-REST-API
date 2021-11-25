const mongoose = require('mongoose')

const cabinsSchema = new mongoose.Schema({ 
    address: {
        type: String,
        required: true,
    },
    size: {
        squaremeter: {
            type: Number,
            required: true,
        },
        rooms: {
            type: Number,
            required: true,
        },
    },
    sauna: {
        type: Boolean,
        required: true,
    },
    beach: {
        type: Boolean,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userID: {
        type: mongoose.Types.ObjectId, ref: 'User'
    },
}, { timestamps: true })

module.exports = mongoose.model(
    'Cabin', 
    cabinsSchema
)
