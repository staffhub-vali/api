import { Schema, model } from 'mongoose'

const eventSchema = new Schema(
	{
		host: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		comments: {
			type: [Schema.Types.ObjectId],
			ref: 'Comment',
		},
		attendees: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
		},
		images: {
			type: String,
		},
		likes: {
			type: Number,
		},
		map: {
			type: String,
		},
		subject: {
			type: String,
		},
		time: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
)

const Event = model('Event', eventSchema)

module.exports = Event
