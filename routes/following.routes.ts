const router = require('express').Router()
const User = require('../models/User.model')
const { isAuthenticated } = require('../middleware/jwt.middleware')
const jwt = require('jsonwebtoken')

import { Request, Response } from 'express'

// follow up other users
router.post('/user/following', isAuthenticated, async (req: Request, res: Response) => {
	const { userId, currentUserId } = req.body
	try {
		const currentUser = await User.findById(currentUserId)
		currentUser.following.push(userId)

		await currentUser.save()

		const userToFollow = await User.findById(userId)

		userToFollow.followers.push(currentUserId)

		await userToFollow.save()

		res.status(200).json({ message: 'Followed successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error following user', error })
	}
})

// Unfollow other users
router.post('/user/unfollowing', isAuthenticated, async (req: Request, res: Response) => {
	const { userId, currentUserId } = req.body
	try {
		const currentUser = await User.findById(currentUserId)
		const followIndex = currentUser.following.indexOf(userId)
		if (followIndex > -1) {
			currentUser.following.splice(followIndex, 1)
		}

		await currentUser.save()

		const userToUnfollow = await User.findById(userId)
		const followerIndex = userToUnfollow.followers.indexOf(currentUserId)
		if (followerIndex > -1) {
			userToUnfollow.followers.splice(followerIndex, 1)
		}

		await userToUnfollow.save()

		res.status(200).json({ message: 'Unfollowed successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error unfollowing user', error })
	}
})

// Get a user's following list by user ID
router.get('/user/:id/following', isAuthenticated, async (req: Request, res: Response) => {
	const { id } = req.params
	try {
		const user = await User.findById(id)
		if (user) {
			res.status(200).json({ following: user.following })
		} else {
			res.status(404).json({ message: 'User not found' })
		}
	} catch (error) {
		res.status(500).json({ message: 'Error fetching user following list', error })
	}
})

// Get user following list with user data
router.get('/user/:id/following-users', isAuthenticated, async (req: Request, res: Response) => {
	const { id } = req.params
	try {
		const user = await User.findById(id).populate('following')
		if (user) {
			res.status(200).json({ followingUsers: user.following })
		} else {
			res.status(404).json({ message: 'User not found' })
		}
	} catch (error) {
		res.status(500).json({ message: 'Error fetching following users', error })
	}
})

// get user followers
router.get('/user/:userId/followers', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.userId).populate('followers')
		res.json(user.followers)
	} catch (err) {
		res.status(400).json({ message: 'Error getting followers.' })
	}
})

module.exports = router
