import cors from 'cors';
import express from 'express';
import http from 'http';

   const hostname = '145.0.46.49'; // Escucha en todas las interfaces


const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());


import login from './Services/login.js';
import registro from './Services/registro.js';
import catalogos from './Services/catalogos.js';

app.use('/api/login', login);
app.use('/api/registro', registro);
app.use('/api/catalogos', catalogos);

app.listen(port, hostname, () => {
    console.log(`El servicio esta corriendo en ${port}`);
})