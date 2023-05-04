const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

import User from '../models/User.model'
import { Request, Response } from 'express'
import { isAuthenticated } from '../middleware/jwt.middleware'

const saltRounds = 10

router.post('/register', async (req: Request, res: Response) => {
	try {
		const { name, username, email, password } = req.body

		if (name === '' || username === '' || email === '' || password === '') {
			res.status(400).json({ message: 'Please fill out all the fields.' })
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
		if (!emailRegex.test(email)) {
			res.status(400).json({ message: 'Please provide a valid email address.' })
			return
		}

		const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
		if (!passwordRegex.test(password)) {
			res.status(400).json({
				message:
					'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
			})
			return
		}

		const user = await User.findOne({ email })
		if (user) {
			res.status(400).json({ message: 'User already exists.' })
			return
		}

		const salt = bcrypt.genSaltSync(saltRounds)
		const hashedPassword = bcrypt.hashSync(password, salt)

		await User.create({ name, username, email, password: hashedPassword })

		res.status(201).json({ message: 'User created successfully.' })
	} catch (err) {
		res.json(err)
	}
})

router.post('/login', async (req: Request, res: Response) => {
	try {
		const { username, password, rememberMe } = req.body

		if (username === '' || password === '') {
			res.status(400).json({ message: 'Please provide an email and a password.' })
			return
		}

		const user = await User.findOne({ username })
		if (!user) {
			res.status(401).json({ message: 'Wrong Email or Password.' })
			return
		}

		const passwordCorrect = bcrypt.compareSync(password, user.password)

		if (passwordCorrect) {
			const { _id, username } = user

			const payload = { _id, username }

			let expiresIn = '6h'
			if (rememberMe) {
				expiresIn = '256h'
			}

			const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
				algorithm: 'HS256',
				expiresIn: expiresIn,
			})

			res.status(200).json({ authToken: authToken, user: { username: user.username, id: user._id } })
		} else {
			res.status(401).json({ message: 'Unable to authenticate the user' })
		}
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' })
	}
})

interface ExpressRequest extends Request {
	payload: {}
}

router.get('/verify', isAuthenticated, (req: ExpressRequest, res: Response) => {
	res.status(200).json(req.payload)
})

export default router
