const router = require('express').Router()
const Message = require('../models/Message.model')
const User = require('../models/User.model')
const Conversation = require('../models/Conversation.model')
const { isAuthenticated } = require('../middleware/jwt.middleware')
import { Request, Response } from 'express'

router.post('/conversation', isAuthenticated, async (req: Request, res: Response) => {
	const { senderId, recipientId, message } = req.body
	console.log(req.body)

	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		}).populate('messages')

		if (conversation) {
			const newMessage = new Message({
				sender: senderId,
				recipient: recipientId,
				message,
			})
			console.log('Message Created.')

			conversation.messages.push(newMessage)

			await Promise.all([newMessage.save(), conversation.save()])

			res.status(200).json({ success: true, message: 'Message added to existing conversation' })
		} else {
			const sender = await User.findById(senderId)
			const recipient = await User.findById(recipientId)

			const newMessage = new Message({
				sender,
				recipient,
				message,
			})

			const newConversation = new Conversation({
				participants: [senderId, recipientId],
				messages: [newMessage],
			})

			sender.conversations.push(newConversation)
			recipient.conversations.push(newConversation)

			await Promise.all([newMessage.save(), newConversation.save(), sender.save(), recipient.save()])

			res.status(200).json({ success: true, message: 'Conversation created successfully' })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: 'Failed to create conversation' })
	}
})

router.delete('/conversation', isAuthenticated, async (req: Request, res: Response) => {
	const { conversationId } = req.query

	const conversation = await Conversation.findById(conversationId)

	const [userIdOne, userIdTwo] = conversation.participants

	const userOne = await User.findById(userIdOne)
	const userTwo = await User.findById(userIdTwo)

	userOne.conversations = userOne.conversations.filter((conversation: {}) => {
		return conversation.toString() !== conversationId
	})

	userTwo.conversations = userTwo.conversations.filter((conversation: {}) => {
		return conversation.toString() !== conversationId
	})

	await Promise.all([userOne.save(), userTwo.save(), Conversation.findByIdAndDelete(conversationId)])

	res.status(200).json({ success: true, message: 'Conversation deleted successfully' })
})

module.exports = router
