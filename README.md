# Memory to Space 🌌

**Memory to Space** is a web service that allows users to generate and visualize memories as images. Users can input a memory (such as a personal experience at a specific location), and the service processes it through NLP (Natural Language Processing) to enhance the description. The memory is then converted into an image using OpenAI's DALL-E model. Users can also request to send the generated memory image to their email.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Installation and Setup](#installation-and-setup)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Environment Variables](#environment-variables)
9. [Logging](#logging)
---

## Project Overview

Memory to Space is designed to help individuals visualize and remember their personal experiences. The service provides the following key functionalities:

- Translate memory descriptions from Hebrew to English (if necessary).
- Enhance the memory descriptions with NLP.
- Generate images using OpenAI DALL-E model based on enhanced memory descriptions.
- Store the generated image in Firebase Storage.
- Send the image to the user’s email.
- Swagger documentation available at `/docs`.

---

## Technologies Used

- **Node.js**: Backend framework for handling requests and services.
- **TypeScript**: Ensures type safety and improves development experience.
- **Express.js**: Web server framework.
- **TSOA**: TypeScript OpenAPI integration for auto-generating Swagger documentation.
- **OpenAI**: Used to generate images from text prompts.
- **Zod**: Validation of request payloads.
- **Firebase**: For storing generated images.
- **MongoDB**: Database to store generated memory details.
- **Mailersend/Nodemailer**: Emailing services for sending generated memory to users.
- **Swagger**: API documentation.

---

## Project Structure

```
src/
├── config/              # Configuration files for Firebase, Email, etc.
├── controllers/         # API route handlers
├── middleware/          # Custom middlewares (error handling)
├── models/              # Mongoose models
├── routes/              # TSOA routes for API
├── services/            # Business logic (NLP, Image generation, Email)
├── types/               # Type definitions and schema validation
├── utils/               # Utility functions (Firebase, Data Access, Logging)
└── app.ts               # Main Express application
```

---

## Features

1. **Generate Image from Text**:
   - Converts user memory text into a visually appealing image using OpenAI's DALL-E model.
   - Translates Hebrew memories into English if necessary.
   
2. **Memory Email Service**:
   - Sends the generated memory and image via email.
   
3. **Health Check Endpoint**:
   - Provides a basic endpoint to check if the service is up and running.
   
4. **Firebase Integration**:
   - Stores the generated image in Firebase Storage.

5. **NLP Service**:
   - Enhances user-provided memory text by adding architectural, emotional, and historical context.

6. **API Documentation**:
   - Automatically generated Swagger documentation available at `/docs`.

---

## Installation and Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- Firebase account with storage bucket
- OpenAI API Key
- Email service credentials (Mailersend/Nodemailer)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/MemoryToSpace/MemorySpace-NodeServer
   cd memory-to-space
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file and configure the following environment variables:

   ```
   NODE_ENV=development
   PORT=3000
   DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/dbname
   DATABASE_PASSWORD=<your-database-password>
   OPENAI_KEY=<your-openai-api-key>
   EMAIL_USERNAME=<your-email-username>
   EMAIL_PASSWORD=<your-email-password>
   EMAIL_HOST=<your-email-host>
   EMAIL_PORT=<your-email-port>
   FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket-url>
   TYPE=<firebase-service-account-type>
   PROJECT_ID=<firebase-project-id>
   PRIVATE_KEY_ID=<firebase-private-key-id>
   PRIVATE_KEY=<firebase-private-key>
   CLIENT_EMAIL=<firebase-client-email>
   CLIENT_ID=<firebase-client-id>
   AUTH_URI=https://accounts.google.com/o/oauth2/auth
   TOKEN_URI=https://oauth2.googleapis.com/token
   AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   CLIENT_X509_CERT_URL=<firebase-client-x509-cert-url>
   MAILERSEND_API_KEY=<mailersend-api-key>
   FROM_EMAIL=<sender-email>
   FROM_NAME=Memory to Space
   ```

4. Start the server in development mode:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   npm start
   ```

---

## Usage

After starting the server, access the following routes:

- **Swagger Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Health Check**: [http://localhost:3000/health-check](http://localhost:3000/health-check)

### Example Usage:

#### Generate Image from Memory
- **POST** `/generate-image/openai`
  
  Request Body:
  ```json
  {
    "text": "A peaceful village by the river with lush green trees"
  }
  ```

  Response:
  ```json
  {
    "_id": "60d5f2c2fc13ae1d7c002b1e",
    "inputText": "A peaceful village by the river with lush green trees",
    "imageUrl": "https://firebase-storage-link/image.png"
  }
  ```

#### Send Memory to Email
- **POST** `/generate-image/send-memory`
  
  Request Body:
  ```json
  {
    "_id": "60d5f2c2fc13ae1d7c002b1e",
    "email": "example@example.com"
  }
  ```

  Response:
  ```json
  {
    "message": "Email sent successfully"
  }
  ```

---

## API Endpoints

| Method | Endpoint                       | Description                           |
|--------|--------------------------------|---------------------------------------|
| GET    | /health-check                  | Check if server is alive              |
| POST   | /generate-image/openai         | Generate image based on text          |
| POST   | /generate-image/send-memory    | Send generated memory to email        |

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

| Variable Name               | Description                                      |
|-----------------------------|--------------------------------------------------|
| `NODE_ENV`                   | Environment (development, production)            |
| `PORT`                       | Port number                                      |
| `DATABASE`                   | MongoDB connection string                        |
| `DATABASE_PASSWORD`          | MongoDB database password                        |
| `OPENAI_KEY`                 | OpenAI API key for generating images             |
| `EMAIL_USERNAME`             | Email service username                           |
| `EMAIL_PASSWORD`             | Email service password                           |
| `EMAIL_HOST`                 | Email server host                                |
| `EMAIL_PORT`                 | Email server port                                |
| `FIREBASE_STORAGE_BUCKET`    | Firebase storage bucket URL                      |
| `MAILERSEND_API_KEY`         | MailerSend API key for email service             |
| `FROM_EMAIL`                 | Email address used to send emails                |
| `FROM_NAME`                  | Name used as sender in email service             |
| `FIREBASE_SERVICE_ACCOUNT`   | Firebase service account credentials             |
| `TYPE`                       | Firebase service account type                    |
| `PROJECT_ID`                 | Firebase project ID                              |
| `PRIVATE_KEY_ID`             | Firebase private key ID                          |
| `PRIVATE_KEY`                | Firebase private key                             |
| `CLIENT_EMAIL`               | Firebase client email                            |
| `CLIENT_ID`                  | Firebase client ID                               |
| `AUTH_URI`                   | Firebase auth URI                                |
| `TOKEN_URI`                  | Firebase token URI                               |
| `AUTH_PROVIDER_X509_CERT_URL`| Firebase Auth Provider X509 certificate URL      |
| `CLIENT_X509_CERT_URL`       | Firebase client X509 certificate URL             |

---

## Logging

The application uses **Winston** for logging. Logs are written to both the console and `combined.log`.

---
