const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const Article = require('../models/Article.model')
const Comment = require('../models/Comment.model')
import { isAuthenticated } from '../middleware/jwt.middleware'
import { Request, Response } from 'express'

router.post('/comment', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const { userId, commentValue, articleId } = req.body

		const author = await User.findById(userId).populate('comments')

		if (!author) {
			return res.status(404).json({ message: 'User not found' })
		}

		const article = await Article.findById(articleId).populate('comments')

		if (!article) {
			return res.status(404).json({ message: 'Article not found' })
		}

		const comment = await Comment.create({ author, article: articleId, content: commentValue })

		author.comments.push(comment)
		article.comments.push(comment)

		await Promise.all([comment.save(), author.save(), article.save()])

		return res.status(200).json({ message: 'Comment created successfully' })
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' })
	}
})

router.put('/comment', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const { editedComment, commentId, userId } = req.body

		const comment = await Comment.findById(commentId)

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' })
		}

		if (comment.author?.toString() !== userId) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		comment.content = editedComment

		await comment.save()

		return res.status(200).json({ message: 'Comment updated successfully' })
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' })
	}
})

router.delete('/comment', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const { commentId, articleId, userId } = req.query

		const deletedComment = await Comment.findByIdAndDelete(commentId)

		if (!deletedComment) {
			return res.status(404).json({ message: 'Comment not found' })
		}

		await Article.updateOne({ _id: articleId }, { $pull: { comments: deletedComment._id } })

		await User.updateOne({ _id: userId }, { $pull: { comments: deletedComment._id } })

		return res.status(200).json({ message: 'Comment deleted successfully' })
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' })
	}
})

module.exports = router
