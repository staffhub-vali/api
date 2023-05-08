import mongoose from 'mongoose'

const EmployeeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true },
	vacationDays: { type: Number, default: 25 },
	email: { type: String, required: true, unique: true },
	rosters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roster' }],
})

const Employee = mongoose.model('Employee', EmployeeSchema)

export default Employee
