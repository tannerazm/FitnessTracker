require("dotenv").config()
const client = require("./db/client.js")
const express = require("express")
const apiRouter = require("./api");
const app = express()

client.connect()
const cors = require('cors');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json())

app.use(cors())
app.use('/api', apiRouter)

// Setup your Middleware and API Router here

module.exports = app;
