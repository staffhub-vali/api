import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.model'
import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

const saltRounds = 10

router.post('/register', async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body

		if (name === '' || email === '' || password === '') {
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

		await User.create({ name, email, password: hashedPassword })

		res.status(201).json({ message: 'User created successfully.' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong.' })
	}
})

router.post('/login', async (req: Request, res: Response) => {
	try {
		const { email, password, rememberMe } = req.body

		if (email === '' || password === '') {
			res.status(400).json({ message: 'Please provide an email and a password.' })
			return
		}

		const user = await User.findOne({ email })
		if (!user) {
			res.status(401).json({ message: 'Wrong Email or Password.' })
			return
		}

		const passwordCorrect = bcrypt.compareSync(password, user.password)

		if (passwordCorrect) {
			const { _id, name } = user

			const payload = { _id, name }

			let expiresIn = '6h'
			if (rememberMe) {
				expiresIn = '365d'
			}

			const TOKEN_SECRET: Secret | undefined = process.env.TOKEN_SECRET

			if (!TOKEN_SECRET) {
				res.status(400).json({ message: 'Token secret is missing.' })
				return
			}

			const token = jwt.sign(payload, TOKEN_SECRET, {
				algorithm: 'HS256',
				expiresIn: expiresIn,
			})

			res.status(200).json({ token: token, user: { name: user.name, id: user._id } })
		} else {
			res.status(401).json({ message: 'Wrong email or password.' })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong.' })
	}
})

router.get('/verify', Authenticate, (req, res) => {
	res.json('Authentication middleware is working.')
})

module.exports = router
