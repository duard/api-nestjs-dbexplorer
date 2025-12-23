import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

function requestLogger(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  console.log(`\n📥 [${timestamp}] ${method} ${url}`);
  console.log(`   IP: ${ip}`);
  console.log(`   User-Agent: ${userAgent}`);

  const originalSend = res.send;
  const startTime = Date.now();

  res.send = function (body) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const statusCode = res.statusCode;

    console.log(
      `📤 [${timestamp}] ${method} ${url} - ${statusCode} (${duration}ms)`,
    );
    console.log(`   Response Status: ${statusCode}`);
    console.log(`   Duration: ${duration}ms`);
    if (body && typeof body === 'object') {
      console.log(`   Response Body:`, JSON.stringify(body, null, 2));
    } else if (body) {
      console.log(`   Response Body:`, body);
    }
    console.log('─'.repeat(80));

    return originalSend.call(this, body);
  };

  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Habilita CORS para todas as origens e métodos (configuração mais permissiva)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
      'http://localhost:3007',
      'http://localhost:3008',
      'http://localhost:3009',
      'http://localhost:3010',
      'http://localhost:3020',
      'http://localhost:3021',
      'http://localhost:3022',
      'http://localhost:3023',
      'http://localhost:3024',
      'http://localhost:3025',
      'http://localhost:3026',
      'http://localhost:3027',
      'http://localhost:3028',
      'http://localhost:3029',
      'http://localhost:3030',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3020',
      'http://127.0.0.1:3027',
      'http://127.0.0.1:8080',
      'https://rh.gigantao.net',
      /^https?:\/\/.+\.gigantao\.net$/,
      /^https?:\/\/.+\.local\.dev$/,
      /^https?:\/\/localhost:\d+$/,
      /^https?:\/\/127\.0\.0\.1:\d+$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
      'X-Per-Page',
      'Content-Disposition',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: [
      'Content-Disposition',
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
      'X-Per-Page',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(requestLogger);

  const config = new DocumentBuilder()
    .setTitle('API Sankhya Simples')
    .setDescription('API for Sankhya Simples integration')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customJs: '/swagger-custom.js',
  });

  await app.listen(port, '0.0.0.0');

  console.log('='.repeat(80));
  console.log('🚀 NESTJS API SERVER STARTED WITH COMPREHENSIVE LOGGING');
  console.log('='.repeat(80));
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI is available on: ${await app.getUrl()}/api`);
  console.log('='.repeat(80));
}
bootstrap();
