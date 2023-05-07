import mongoose from 'mongoose'

interface EmployeeDocument extends mongoose.Document {
	name: string
	email: string
	phone?: string
	shifts: string[]
}

const EmployeeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
})

const Employee = mongoose.model<EmployeeDocument>('Employee', EmployeeSchema)

export default Employee
