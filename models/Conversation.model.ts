import { Schema, model } from 'mongoose'

const conversationSchema = new Schema(
	{
		messages: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	},
)

const Conversation = model('Conversation', conversationSchema)

module.exports = Conversation
