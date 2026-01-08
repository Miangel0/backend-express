require('dotenv').config();
const express = require('express');

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma');
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const bodyParser = require('body-parser');

const LoggerMiddleware = require('./src/middlewares/logger.js')
const errorHandler = require('./src/middlewares/errorHandler.js')
const { validateUser } = require('./src/utils/validation.js');
const authenticatedToken = require('./src/middlewares/auth.js');

const fs = require('fs');
const path =require('path')
const usersFilePath = path.join(__dirname, 'users.json')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(LoggerMiddleware); 
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso de ExpressJS</h1>
        <p>Esto es una aplicaciòn Nodejs con Expressjs</p>
        <p>Corre en el puerto ${PORT}</p>
        `)
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Mostrar  informacion del usuario con el ID: ${userId}`);
});

app.get('/search', (req, res) =>{
    const terms = req.query.termino || 'No especificado'
    const category = req.query.categoria || 'Todas'

    res.send(`
        <h2>Resultados de Busqueda</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `)
});

app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anonimo';
    const email = req.body.email || 'No proporcionado';

    res.json({
        message: 'Datos recibidos',
        data: {
            name, email
        }
    })
});

app.post('/api/data', (req, res) =>{
    const data = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    res.status(201).json({
        message: 'Datos JSON recibidos',
        data
    });
});

app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({ error: 'Error con conexión de datos' })
        }
        const user = JSON.parse(data);
        res.json(user);
    });
});

app.post('/users', (req, res) =>  {
    const newUser = req.body;
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
            return res.status(500),json({ error: 'Error con conexion de datos' })
        }
        const users = JSON.parse(data);
        const validation = validateUser(newUser, users)
        if(!validation.isValid){
            return res.status(400).json( { error: validation.error } )
        }  

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) =>{
            if(err){
                return res.status(500).json({ error: 'Error al guardar el usuario' })
            }
            res.status(201).json(newUser);
        });
    });
});

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUser = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexiÃ³n de datos.' });
    }
    let users = JSON.parse(data);
    const validation = validateUser(updatedUser, users, userId)
    if(!validation.isValid){
        return res.status(400).json( { error: validation.error } )
    }
    users = users.map(user =>
      user.id === userId ? { ...user, ...updatedUser } : user
    );
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error al actualizar el usuario' });
      }
      res.json(updatedUser);
    });
  });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10)
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
         if(err){
            return res.status(500).json({ error: 'Error con conexiÃ³n de datos.' });
         }
         let users = JSON.parse(data);
         users = users.filter(user => user.id !== userId);
         fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if(err){
                return res.status(500).json( {error: 'Error al eliminar al usuario'} )
            }
            res.status(204).send();
         });
    });
});

app.get('/error', (req, res, next) => {
    next(new Error('Error intencional'))
})

app.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al comunicarse con la base de datos' })
    }
});

app.get('/protected-route', authenticatedToken, (req, res) => {
    res.send("Esta es una ruta protegida");
});

app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
        }
    });
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  // Extraer email y password del cuerpo de la solicitud
  const { email, password } = req.body;
  
  // Buscar el usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  // Validar si el usuario existe
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  
  // Verificar si la contraseña coincide
  const validPassword = await bcrypt.compare(password, user.password);
  
  // Validar si la contraseña es correcta
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  
  // Generar token JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '4h' }
  );
  
  // Devolver el token al cliente
  res.json({ token });
});

app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`);
})