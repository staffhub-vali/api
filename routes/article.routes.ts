const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const Article = require('../models/Article.model')
import { isAuthenticated } from '../middleware/jwt.middleware'
import { Request, Response } from 'express'

// List of articles
router.get('/community/articles', async (req: Request, res: Response) => {
	try {
		const data = await Article.find().populate('author')
		res.json(data)
	} catch (err) {
		res.status(500).json({
			message: 'Error retrieving Articles.',
		})
	}
})

//Creating an article
router.post('/community/articles', async (req: Request, res: Response) => {
	try {
		const { userId, title, content, imageUrl } = req.body
		console.log(content)

		if (!userId || !title || !content) {
			console.log('Missing required fields.')
			return res.status(400).json({
				message: 'Missing required fields',
			})
		}
		const author = await User.findById(userId)

		if (!author) {
			console.log('User not found')
			return res.status(404).json({
				message: 'User not found',
			})
		}

		const article = await Article.create({
			author,
			title,
			content,
			imageUrl,
		})

		if (!article) {
			console.log('Error creating Article')
			return res.status(404).json({ message: 'Error creating Article' })
		}
		await author.updateOne({ $push: { articles: article } })

		res.status(201).json(article)
	} catch (error) {
		console.error('Error creating article:', error)
		res.status(500).json({
			message: 'Error creating Article',
		})
	}
})

// Individual article
router.get('/community/article/:articleId', async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params

		const articleDetails = await Article.findById(articleId)
			.populate('author')
			.populate({
				path: 'comments',
				populate: {
					path: 'author',
					model: 'User',
				},
			})

		res.json(articleDetails)
	} catch (err) {
		res.status(500).json({
			message: 'Error retrieving the Article',
		})
	}
})

// Editing an article
router.put('/community/article/:articleId', async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params

		const updatedArticle = await Article.findByIdAndUpdate(articleId, req.body, { new: true })

		if (!updatedArticle) {
			return res.status(404).json({ message: 'Article not found' })
		}
		res.json(updatedArticle)
	} catch (error) {
		res.status(500).json({ message: 'Error updating Article' })
	}
})

//Deleting an article
router.delete('/community/article/:articleId', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const { articleId, userId } = req.query
		if (!articleId || !userId) {
			return res.status(400).json({ message: 'Missing query Parameters.' })
		}

		const article = await Article.findById(articleId).populate('comments').populate('author')
		if (!article) {
			return res.status(404).json({ message: 'Article not found.' })
		}

		if (article.author?._id.toString() !== userId) {
			return res.status(403).json({ message: 'Forbidden' })
		}

		const user = await User.findById(userId).populate('articles').populate('comments')
		if (!user) {
			return res.status(404).json({ message: 'User not found.' })
		}

		const articleIndex = user.articles.findIndex((a: { _id: any }) => a._id.equals(articleId))

		if (articleIndex !== -1) {
			user.articles.splice(articleIndex, 1)
			await user.save()
		}

		for (const comment of article.comments) {
			const commentIndex = user.comments.findIndex((c: { _id: any }) => c._id.equals(comment._id))
			if (commentIndex !== -1) {
				user.comments.splice(commentIndex, 1)
				await user.save()
			}

			await Comment.findByIdAndDelete(comment._id)
		}

		await Article.findByIdAndDelete(articleId)

		res.status(200).json({ message: 'Article deleted Successfully.' })
	} catch (err) {
		res.status(500).json({ message: 'Error deleting Article' })
	}
})

// List of articles on a users profile
router.get('/users/:userId/articles', async (req: Request, res: Response) => {
	const userId = req.params.userId
	try {
		const articles = await Article.find({ author: userId }).populate('author')
		res.status(200).json({ articles })
	} catch (error) {
		res.status(500).json({
			message: 'Error getting the list of Articles',
		})
	}
})

// Liking an article
router.post('/community/article/:articleId/like', async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params
		const { userId } = req.body

		const updatedArticle = await Article.findByIdAndUpdate(
			articleId,

			{
				$inc: { likes: 1 },
				$push: { likedBy: userId },
			},
			{ new: true },
		)
		if (!updatedArticle) {
			return res.status(404).json({ message: 'Article not found' })
		}
		res.json(updatedArticle)
	} catch (error) {
		res.status(500).json({ message: 'Error updating Article' })
	}
})

// Disliking an article
router.put('/community/article/:articleId/like', async (req: Request, res: Response) => {
	try {
		const { articleId } = req.params
		const { userId } = req.body

		// Decrease likes count and remove user ID from likedBy array
		const updatedArticle = await Article.findByIdAndUpdate(
			articleId,
			{
				$inc: { likes: -1 },
				$pull: { likedBy: userId },
			},
			{ new: true },
		)

		if (!updatedArticle) {
			return res.status(404).json({ message: 'Article not found' })
		}
		res.json(updatedArticle)
	} catch (error) {
		res.status(500).json({ message: 'Error updating Article' })
	}
})

module.exports = router
