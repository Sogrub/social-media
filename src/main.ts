import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT
  const HOST = process.env.HOST;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  const config = new DocumentBuilder()
    .setTitle('Backend Social Media')
    .setDescription(`Desarrollar una aplicación de red social que permita a los usuarios registrarse, iniciar sesión, publicar mensajes, \
    ver el muro, buscar mensajes y funcionalidades extra (puntos adicionales)`)
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .addTag('Authentication')
    .addTag('User')
    .addTag('Post')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customSiteTitle: 'Social Media API',
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        },
      },
    }
  });
  
  await app.listen(PORT);
}
bootstrap();
