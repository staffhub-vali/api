import { Schema, model } from 'mongoose'

const messageSchema = new Schema(
	{
		message: {
			type: String,
			required: [true, 'Message is required.'],
		},

		sender: {
			type: Schema.Types.ObjectId,
			required: [true, 'Sender is required.'],
			ref: 'User',
		},
		recipient: {
			type: Schema.Types.ObjectId,
			required: [true, 'Recipient is required.'],
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
)

const Message = model('Message', messageSchema)

module.exports = Message
