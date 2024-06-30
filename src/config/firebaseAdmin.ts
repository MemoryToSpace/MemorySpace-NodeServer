// src/config/firebaseAdmin.ts
import admin from 'firebase-admin';
import { vars } from './vars';

admin.initializeApp({
  credential: admin.credential.cert(vars.firebaseServiceAccount as admin.ServiceAccount),
  storageBucket: vars.firebaseStorageBucket,
});

const bucket = admin.storage().bucket();

export default bucket;
