import mongoose from 'mongoose'

const rosterSchema = new mongoose.Schema({
	month: { type: String, required: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
})

const Roster = mongoose.model('Roster', rosterSchema)

export default Roster
