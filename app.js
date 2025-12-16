require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso de ExpressJS</h1>
        <p>Esto es una aplicaciòn Nodejs con Expressjs</p>
        <p>Corre en el puerto ${PORT}</p>
        `)
});

app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`);
});

