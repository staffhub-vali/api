import WorkDay from './WorkDay.model'
import Employee from './Employee.model'
import mongoose, { Document, Schema, Model } from 'mongoose'

interface User extends Document {
	name: string
	email: string
	password: string
	workDays: WorkDay[]
	employees: Employee[]
}

const userSchema: Schema<User> = new mongoose.Schema(
	{
		name: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		workDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' }],
		employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
	},
	{ timestamps: true },
)

const User: Model<User> = mongoose.model<User>('User', userSchema)

export default User
