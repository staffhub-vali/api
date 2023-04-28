// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config()

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
import express from 'express'

export const app = express()

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)

// 👇 Start handling routes here

app.use('/auth', require('./routes/auth.routes'))

app.use('/api', require('./routes/user.routes'))
app.use('/api', require('./routes/index.routes'))
app.use('/api', require('./routes/report.routes'))
app.use('/api', require('./routes/article.routes'))
app.use('/api', require('./routes/comment.routes'))
app.use('/api', require('./routes/message.routes'))
app.use('/api', require('./routes/following.routes'))
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)
