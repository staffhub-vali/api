import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Employee extends Document {
	name: string
	phone: string
	email: string
	notes: string[]
	vacationDays: number
	shiftPreferences: string[]
}

const employeeSchema: Schema<Employee> = new mongoose.Schema({
	name: { type: String },
	phone: { type: String },
	email: { type: String },
	notes: { type: [String] },
	shiftPreferences: { type: [String] },
	vacationDays: { type: Number, default: 25 },
})

const Employee: Model<Employee> = mongoose.model<Employee>('Employee', employeeSchema)

export default Employee
