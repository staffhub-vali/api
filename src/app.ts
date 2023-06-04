import cors from 'cors'
import config from 'config'
import dotenv from 'dotenv'
import express from 'express'
import connect from './db/connect'

dotenv.config()

const PORT = process.env.PORT || config.get('PORT')

const app = express()

const FRONTEND_URL = process.env.ORIGIN || (config.get('ORIGIN') as string)
const allowedOrigins = [FRONTEND_URL]

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/v1/auth', require('./routes/auth.routes'))
app.use('/v1/days', require('./routes/days.routes'))
app.use('/v1/shifts', require('./routes/shift.routes'))
app.use('/v1/roster', require('./routes/roster.routes'))
app.use('/v1/employees', require('./routes/employees.routes'))

app.listen(PORT, () => {
	console.log(`Server listing on port ${PORT}.`)
	connect()
})

console.clear()
