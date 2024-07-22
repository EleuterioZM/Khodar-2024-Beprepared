import * as dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string(),
  APP_ENV: z.string(),
  SECRETE: z.string(),
  DATABASE_URL: z.string(),
  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_MESSAGING_SENDER_ID: z.string(),
  FIREBASE_APP_ID: z.string(),
  FIREBASE_GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Environment variables validation failed:', env.error.format());
  process.exit(1);
}

export const {
  PORT,
  APP_ENV,
  SECRETE,
  DATABASE_URL,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_GOOGLE_APPLICATION_CREDENTIALS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = env.data;

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};
