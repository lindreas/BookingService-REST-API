const mongoose = require('mongoose')

const bookingsSchema = mongoose.Schema({
    cabin: { 
        type: mongoose.Types.ObjectId, ref: 'Cabin', required: true 
    },
    from: {
         type: Date, required: true
    },
    to: {
         type: Date, required: true
    },
    userID: {
        type: mongoose.Types.ObjectId, ref: 'User'
    }
});

module.exports = mongoose.model(
    'Booking', 
    bookingsSchema
)
