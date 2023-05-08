import mongoose from 'mongoose'

const rosterSchema = new mongoose.Schema({
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
	month: { type: String, required: true },
	workingDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkingDay' }],
})

const Roster = mongoose.model('Roster', rosterSchema)

export default Roster
