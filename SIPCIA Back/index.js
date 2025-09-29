import cors from 'cors';
import express from 'express';
import http from 'http';
import path from "path";
import { fileURLToPath } from "url";

const hostname = '145.0.46.49';

const app = express();
const port = 4000;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors());


import login from './Services/login.js';
import registro from './Services/registro.js';
import catalogos from './Services/catalogos.js';
import directorio from './Services/directorio.js';
import bitacora from './Services/bitacora.js';
import reportes  from './Services/reportes/instanciasRepetidas.js';
import atencion from './Services/reportes/atencionConsultas.js';
import afluencia from './Services/mayorAfluencia/registroAfluencia.js';
import lugares from './Services/lugaresAsambleas/registroLugares.js';
import instituciones from './Services/instituciones/catalogoInstituciones.js';
import fichas from './Services/fichas/fichaInd.js';
import fichasAfro from './Services/fichas/fichaAfro.js';
import reportesDes from './Services/reportes/reporteDirectorioIndigena.js';
import descargaDoc from './Services/uploads/descargaDocs.js';
import cargaNormativo from './Services/uploads/cargaNormvativos.js';

app.use('/api/login', login);
app.use('/api/registro', registro);
app.use('/api/catalogos', catalogos);
app.use('/api/directorio', directorio);
app.use('/api/bitacora', bitacora);
app.use('/api/reportes', reportes);
app.use('/api/atencion', atencion);
app.use('/api/afluencia', afluencia);
app.use('/api/lugares', lugares);
app.use('/api/instituciones', instituciones);
app.use('/api/fichas', fichas);
app.use('/api/fichasAfro', fichasAfro);
app.use('/api/reportesDes', reportesDes);
app.use('/api/descargaDoc', descargaDoc);
app.use('/api/cargaNormativo', cargaNormativo);

app.use(
  '/Services/uploads',
  express.static(path.join(process.cwd(), 'Services', 'uploads'))
);


app.listen(port, hostname, () => {
});