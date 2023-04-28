import { Schema, model } from 'mongoose'

const articleSchema = new Schema(
	{
		author: {
			ref: 'User',
			type: Schema.Types.ObjectId,
		},
		comments: {
			ref: 'Comment',
			type: [Schema.Types.ObjectId],
		},
		content: {
			required: [true, 'Content is required.'],
			type: String,
		},
		description: {
			default: null,
			type: String,
		},
		imageUrl: {
			default: null,
			type: String,
		},
		likedBy: {
			ref: 'User',
			type: [Schema.Types.ObjectId],
		},
		likes: {
			default: 0,
			type: Number,
		},
		title: {
			required: [true, 'Title is required.'],
			type: String,
		},
	},
	{
		timestamps: true,
	},
)

const Article = model('Article', articleSchema)

module.exports = Article
