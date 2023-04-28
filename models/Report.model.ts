import { Schema, model } from 'mongoose'

const reportSchema = new Schema(
	{
		id: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Article',
				},
				{
					type: Schema.Types.ObjectId,
					ref: 'Comment',
				},
				{
					type: Schema.Types.ObjectId,
					ref: 'Conversation',
				},
				{
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		content: {
			type: String,
			required: true,
		},

		subject: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
)

const Report = model('Report', reportSchema)

module.exports = Report
