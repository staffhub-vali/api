import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Employee extends Document {
	name: string
	phone: string
	email: string
	sickDays: number
	vacationDays: number
}

const employeeSchema: Schema<Employee> = new mongoose.Schema({
	name: { type: String },
	phone: { type: String },
	email: { type: String },
	sickDays: { type: Number, default: 0 },
	vacationDays: { type: Number, default: 25 },
})

const Employee: Model<Employee> = mongoose.model<Employee>('Employee', employeeSchema)

export default Employee
