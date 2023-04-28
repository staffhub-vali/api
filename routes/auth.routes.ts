const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
import { isAuthenticated } from '../middleware/jwt.middleware'

import { Request, Response, NextFunction } from 'express'

const saltRounds = 10

router.post('/signup', (req: Request, res: Response) => {
	const { firstName, lastName, username, email, password } = req.body

	if (email === '' || password === '' || username === '' || firstName === '' || lastName === '') {
		res.status(400).json({ message: 'Please fill out all the fields.' })
		return
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
	if (!emailRegex.test(email)) {
		res.status(400).json({ message: 'Provide a valid email address.' })
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

	User.findOne({ email })
		.then((user: {}) => {
			if (user) {
				res.status(400).json({ message: 'User already exists.' })
				return
			}

			const salt = bcrypt.genSaltSync(saltRounds)
			const hashedPassword = bcrypt.hashSync(password, salt)

			return User.create({ email, password: hashedPassword, username, firstName, lastName })
		})
		.then(() => {
			res.status(201).json({ message: 'User created successfuly.' })
		})
		.catch((err: {}) => res.json(err))
})

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
	const { email, password, rememberMe } = req.body

	if (email === '' || password === '') {
		res.status(400).json({ message: 'Please provide an email and a password.' })
		return
	}

	User.findOne({ email })
		.then((user: { _id: string; username: string; password: string }) => {
			if (!user) {
				res.status(401).json({ message: 'Wrong Email or Password.' })
				return
			}

			const passwordCorrect = bcrypt.compareSync(password, user.password)

			if (passwordCorrect) {
				const { _id, username } = user

				const payload = { id: _id, username }

				let expiresIn = '24h'
				if (rememberMe) {
					expiresIn = '48h'
				}

				const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
					algorithm: 'HS256',
					expiresIn: expiresIn,
				})

				res.status(200).json({ authToken: authToken, user: { username: user.username, id: user._id } })
			} else {
				res.status(401).json({ message: 'Unable to authenticate the user' })
			}
		})
		.catch((err: {}) => next(err))
})

router.post('/verifyPass', isAuthenticated, async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		User.findOne({ email }).then((user: { _id: string; password: string }) => {
			if (!user) {
				res.status(404).json({ message: 'User not found.' })
				return
			}

			const passwordCorrect = bcrypt.compareSync(password, user.password)

			if (!passwordCorrect) {
				res.status(404).json({ message: 'Wrong password.' })
				return
			}

			res.status(200).json({ message: 'Password verified.' })
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Failed to verify password' })
	}
})

router.post('/email', isAuthenticated, async (req: Request, res: Response) => {
	const { currentEmail, newEmail, password } = req.body

	try {
		User.findOne({ email: currentEmail }).then(
			(user: { email: string; password: string; save: () => void }) => {
				if (!user) {
					res.status(404).json({ message: 'User not found.' })
					return
				}

				const passwordCorrect = bcrypt.compareSync(password, user.password)

				if (!passwordCorrect) {
					res.status(404).json({ message: 'Wrong password.' })
					return
				}

				user.email = newEmail
				user.save()

				res.status(200).json({ message: 'Email changed successfuly.' })
			},
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Failed to verify password' })
	}
})

router.post('/password', isAuthenticated, async (req: Request, res: Response) => {
	const { password, newPassword, confirmedPassword, userId } = req.body
	console.log(req.body)

	if (newPassword !== confirmedPassword) {
		return res.status(400).json({ message: 'New password and confirmed password do not match' })
	}

	try {
		const user = await User.findById(userId)

		const passwordCorrect = await bcrypt.compare(password, user.password)
		if (!passwordCorrect) {
			return res.status(400).json({ message: 'Current password is incorrect' })
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10)
		user.password = hashedPassword
		await user.save()

		res.json({ message: 'Password updated successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
})

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req: any, res: Response) => {
	// If JWT token is valid the payload gets decoded by the
	// isAuthenticated middleware and is made available on `req.payload`
	console.log(`req.payload`, req.payload)

	// Send back the token payload object containing the user data
	res.status(200).json(req.payload)
})

module.exports = router
