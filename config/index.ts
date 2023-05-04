import express from 'express'

const logger = require('morgan')

const cookieParser = require('cookie-parser')

const cors = require('cors')

const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:3000'

module.exports = (app: { set: (arg0: string, arg1: number) => void; use: (arg0: any) => void }) => {
	app.set('trust proxy', 1)

	app.use(
		cors({
			origin: [FRONTEND_URL],
		}),
	)

	app.use(logger('dev'))

	app.use(cookieParser())
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))
}
