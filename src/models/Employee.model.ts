import mongoose, { Document, Schema, Model, Types, ObjectId } from 'mongoose'

interface Employee extends Document {
	name: string
	phone: string
	email: string
	notes: string[]
	address: string
	vacationDays: number
	shiftPreferences: string[]
	vacations: { start: number; end: number }[]
	user: ObjectId
}

const employeeSchema: Schema<Employee> = new mongoose.Schema({
	name: { type: String },
	phone: { type: String },
	email: { type: String },
	address: { type: String },
	notes: { type: [String] },
	shiftPreferences: { type: [String] },
	vacationDays: { type: Number, default: 25 },
	vacations: { type: [{ start: Number, end: Number }] },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Employee: Model<Employee> = mongoose.model<Employee>('Employee', employeeSchema)

export default Employee
