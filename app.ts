import express from 'express'

const app = express()

require('./config')(app)

require('dotenv').config()

require('./error-handling')(app)

app.use('/v1/auth', require('./routes/auth.routes'))

export default app
