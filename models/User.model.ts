import { Schema, model } from 'mongoose'

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		username: {
			type: String,
			unique: true,
			lowercase: true,
			required: [true, 'Username is required'],
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: [true, 'Email is required.'],
		},
		password: {
			type: String,
			required: [true, 'Password is required.'],
		},
	},
	{
		timestamps: true,
	},
)

const User = model('User', userSchema)

export default User
