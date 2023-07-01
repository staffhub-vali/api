import express from 'express'
import User from '../models/User.model'
import { Request, Response } from 'express'
import jwt, { decode } from 'jsonwebtoken'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
	try {
		const TOKEN_SECRET: string | undefined = process.env.GOOGLE_CLIENT_SECRET

		if (!TOKEN_SECRET) {
			return res.status(400).json({ message: 'Token secret is missing.' })
		}

		const { credential, clientId } = req.body

		if (clientId !== process.env.GOOGLE_CLIENT_ID) {
			return res.status(401).json({ message: 'Invalid client ID.' })
		}

		const { name, email }: any = decode(credential)

		let user = await User.findOne({ email })

		if (!user) {
			user = await User.create({ name: name, email: email })
		}

		const { _id } = user

		const payload = { _id, name }

		const token = jwt.sign(payload, TOKEN_SECRET, {
			algorithm: 'HS256',
		})

		res.status(200).json(token)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong.' })
	}
})

router.get('/verify', Authenticate, (req, res) => {
	res.json('Authentication middleware is working.')
})

module.exports = router
