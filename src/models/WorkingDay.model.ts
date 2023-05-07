import mongoose from 'mongoose'

const workingDaySchema = new mongoose.Schema({
	date: { type: Date },
	shifts: { type: 'mongoose.Schema.Types.ObjectId', ref: 'Shift' },
})

const WorkingDay = mongoose.model('Day', workingDaySchema)

export default WorkingDay
