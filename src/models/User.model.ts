import mongoose, { Document, Schema, Model } from 'mongoose'

interface User extends Document {
	name: string
	password: string
	email: string
	createdAt?: Date
	updatedAt?: Date
}

const userSchema: Schema<User> = new mongoose.Schema(
	{
		name: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true, unique: true },
	},
	{ timestamps: true },
)

const User: Model<User> = mongoose.model<User>('User', userSchema)

export default User
