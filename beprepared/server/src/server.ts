import 'dotenv/config';
import Fastify from 'fastify';
import Cors from '@fastify/cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { routes } from './routes';
import { PORT, firebaseConfig } from './config/firebase';
import fs from 'fs';
import path from 'path';
import './database/redis';

// Corrigir o caminho do arquivo de credenciais do Firebase
const serviceAccountPath = path.resolve(__dirname, '.firebase/beprepared-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Inicializa o Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
  ...firebaseConfig,
});

const fastify = Fastify({
  logger: true
});

fastify.register(Cors,{
  origin: '*'
});

fastify.register(routes);

fastify.listen({ port: Number(PORT) }).then(() => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
