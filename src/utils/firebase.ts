// src/utils/firebase.ts
import bucket from '../config/firebaseAdmin';

export const uploadBufferToFirebase = async (buffer: Buffer, fileName: string): Promise<string> => {
  const file = bucket.file(`images/${fileName}`);
  await file.save(buffer, {
    metadata: { contentType: 'image/png' },
    public: true,
  });
  return file.publicUrl();
};
