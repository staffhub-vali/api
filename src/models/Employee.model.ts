import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Employee extends Document {
	name: string
	phone: string
	vacationDays: number
	email: string
	rosters: Types.ObjectId[]
}

const employeeSchema: Schema<Employee> = new mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true },
	vacationDays: { type: Number, default: 25 },
	email: { type: String, required: true, unique: true },
	rosters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roster' }],
})

const Employee: Model<Employee> = mongoose.model<Employee>('Employee', employeeSchema)

export default Employee
