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

  // =============================================
  // ✅ Lista explícita de domínios permitidos
  // =============================================
  const allowedOrigins = [
    // 🔹 LOCAL
    'http://localhost:3001', // Frontend local
    'http://localhost:3101',
    'http://localhost:5173', // Dashboard de Veiculos
    'http://localhost:9300',
    'http://localhost:9200',
    'http://localhost:9100',
    'http://localhost:9400',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:9300',
    'http://127.0.0.1:9200',
    'http://127.0.0.1:9100',
    'http://127.0.0.1:9400',
    'https://rh-local.gigantao.net',
    'https://api-local.gigantao.net',
    'https://api-pontotel-local.gigantao.net',
    'https://api-auth-local.gigantao.net',

    // 🔹 DEVELOPMENT
    'https://rh-dev.gigantao.net',
    'https://api-dev.gigantao.net',
    'https://api-pontotel-dev.gigantao.net',
    'https://api-auth-dev.gigantao.net',

    // 🔹 HOMOLOGATION
    'https://rh-homolog.gigantao.net',
    'https://api-homolog.gigantao.net',
    'https://api-pontotel-homolog.gigantao.net',
    'https://api-auth-homolog.gigantao.net',

    // 🔹 TEST
    'https://rh-test.gigantao.net',
    'https://api-test.gigantao.net',
    'https://api-pontotel-test.gigantao.net',
    'https://api-auth-test.gigantao.net',

    // 🔹 PRODUCTION
    'https://rh.gigantao.net',
    'https://api.gigantao.net',
    'https://api-pontotel.gigantao.net',
    'https://api-gigantao-raw-auth-notify.gigantao.net',

    // 🔹 Serviços auxiliares
    'https://carlos.gigantao.net',

    // 🔹 Fallback localhost (para devs na rede)
    'http://192.168.1.9:9200',
    'http://192.168.1.9:9300',
    'http://192.168.1.9:9100',
    'http://192.168.1.9:9400',
  ];

  // Habilita CORS com configuração explícita
  app.enableCors({
    origin: allowedOrigins,
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
      'If-None-Match',
      'If-Modified-Since',
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
