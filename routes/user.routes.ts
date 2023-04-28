const router = require('express').Router()
const User = require('../models/User.model')
const { isAuthenticated } = require('../middleware/jwt.middleware')
const jwt = require('jsonwebtoken')
import { Request, Response } from 'express'

interface PayloadRequest extends Request {
	payload: { id: string }
}

// view other user's profile
router.get('/user', async (req: Request, res: Response) => {
	const { userId } = req.query

	try {
		const user = await User.findById(userId)
			.populate({
				path: 'conversations',
				populate: [{ path: 'messages' }, { path: 'participants' }],
			})
			.populate('following')
			.populate('followers')
		if (!user) {
			return res.status(404).json({ message: 'User not found.' })
		}

		return res.json(user)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'Server error' })
	}
})

router.get('/users', async (req: Request, res: Response) => {
	try {
		const users = await User.find()
		if (!users) {
			return res.status(404).json({ message: 'No users found.' })
		}

		return res.json(users)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'Server error' })
	}
})

router.get('/users/current', isAuthenticated, async (req: PayloadRequest, res: Response) => {
	const { id } = req.payload

	try {
		const user = await User.findById(id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		return res.json(user)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'Server error' })
	}
})

router.put('/users/current', isAuthenticated, async (req: PayloadRequest, res: Response) => {
	const { id } = req.payload
	console.log(req.payload)
	try {
		const user = await User.findById(id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		user.username = req.body.username || user.username
		user.location = req.body.location || user.location
		user.profession = req.body.profession || user.profession
		user.description = req.body.description || user.description
		user.profilePicture = req.body.profilePicture || user.profilePicture

		console.log(req.body.profilePicture)
		await user.save()
		const authToken = jwt.sign({ username: user.username, id: user._id }, process.env.TOKEN_SECRET, {
			algorithm: 'HS256',
			expiresIn: '24h',
		})
		return res.json({ user: { username: user.username, id: user._id }, authToken })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'Server error' })
	}
})

module.exports = router
