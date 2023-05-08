import mongoose from 'mongoose'

const workingDaySchema = new mongoose.Schema({
	date: { type: String, required: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
})

const WorkingDay = mongoose.model('workingDay', workingDaySchema)

export default WorkingDay
