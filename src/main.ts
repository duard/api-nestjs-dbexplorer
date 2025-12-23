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
