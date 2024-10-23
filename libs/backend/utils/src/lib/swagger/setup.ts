import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupAppSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const title = configService.get('swagger.title');
  const description = configService.get('swagger.description');
  const version = configService.get('swagger.version');

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag('API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('swagger', app, document);
}
