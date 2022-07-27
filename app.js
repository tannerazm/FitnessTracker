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

// ROUTER: /api/unknown
app.get('*', (req, res) => {
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
  });

app.get('/users/register', (req, res) => {
    res.send({error: 'Cannot do that', message: message, });
  });

// app.use((error, req, res) => {
//     console.error('SERVER ERROR: ', error);
//     if(res.statusCode < 400) res.status(500);
//     res.send({error: error.message, name: error.name, message: error.message, table: error.table});
//   });
  

module.exports = app;
