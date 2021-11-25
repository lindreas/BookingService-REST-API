require('dotenv').config()
const express = require('express')
const app = express()

// Creating the connection to mongoDB with mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB'))

const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Node is working!"})
})

const cabinsRouter = require('./routes/cabins')
app.use('/cabins', cabinsRouter)

const bookingsRouter = require('./routes/bookings')
app.use('/bookings', bookingsRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))