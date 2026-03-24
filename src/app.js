const express = require('express');
const routes = require('./routes');
const app = express();
const LoggerMiddleware = require('./middlewares/logger.js')
const errorHandler = require('./middlewares/errorHandler.js')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:8081', // tu frontend
    credentials: true
}));
app.use(express.json());
app.use(LoggerMiddleware); 

app.use('/api', routes)

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Hello world')
})

module.exports = app