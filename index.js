const express = require('express')
const app = express()
const { typeError } = require('./middlewares/error')
const { dbConnection } = require('./config/config')
const cors = require('cors')

require('dotenv').config()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
dbConnection()

app.use('/products', require('./routes/products'))
app.use('/users', require('./routes/users'))
app.use('/orders', require('./routes/orders'))

app.use(typeError)

app.listen(PORT, () => `Server started at por t${PORT}`)
