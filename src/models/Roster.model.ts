import mongoose from 'mongoose'

const rosterSchema = new mongoose.Schema({
	month: { type: Date, required: true, unique: true },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
	workingDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkingDay' }],
})

const Roster = mongoose.model('Roster', rosterSchema)

export default Roster
