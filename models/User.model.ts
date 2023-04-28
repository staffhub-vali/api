import { Schema, model } from 'mongoose'

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required.'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required.'],
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required.'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required.'],
		},
		description: {
			type: String,
		},
		profilePicture: {
			type: String,
			default: 'https://i.pinimg.com/originals/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg',
		},
		location: {
			type: Object,
		},
		profession: {
			type: String,
		},
		articles: {
			type: [Schema.Types.ObjectId],
			ref: 'Article',
		},
		comments: {
			type: [Schema.Types.ObjectId],
			ref: 'Comment',
		},
		conversations: {
			type: [Schema.Types.ObjectId],
			ref: 'Conversation',
		},
		events: {
			type: [Schema.Types.ObjectId],
			ref: 'Event',
		},
		followers: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
		},
		following: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
)

const User = model('User', userSchema)

module.exports = User
