import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function initializeServer() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3002'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
  });

  app.use(helmet());
  app.use(cookieParser());
  
  // Configure CSRF protection with proper cookie settings for frontend access
  app.use(
    csrf({
      cookie: {
        key: 'XSRF-TOKEN',
        httpOnly: false, // Allow frontend JavaScript to access it
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // Secure in production only
        path: '/',
      },
    }),
  );
  
  // Add middleware to expose CSRF token in both cookie and header
  app.use((req, res, next) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    res.header('X-CSRF-Token', token);
    next();
  });
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}
initializeServer();
