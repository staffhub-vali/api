import mongoose from 'mongoose'

const workDaySchema = new mongoose.Schema({
	date: { type: Date, required: true, unique: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
})

const WorkDay = mongoose.model('WorkDay', workDaySchema)

export default WorkDay
