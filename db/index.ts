import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/database'

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log(`Connected to Database.`)
	})
	.catch((error: {}) => {
		console.error('Error connecting to Database. ', error)
	})
