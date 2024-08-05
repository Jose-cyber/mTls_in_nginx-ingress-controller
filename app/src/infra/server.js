const express = require('express')
const app = express()

// importing my routes
const appRoutes = require('../routes/appRoutes')

app.use(appRoutes)

module.exports = app