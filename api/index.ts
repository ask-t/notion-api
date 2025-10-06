import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log']
    });

    // CORSを有効化
    app.enableCors();

    // バリデーションパイプを有効化
    app.useGlobalPipes(new ValidationPipe());

    // Swagger設定
    const config = new DocumentBuilder()
      .setTitle('Notion API')
      .setDescription('Notion API のドキュメント')
      .setVersion('1.0')
      .addTag('notion')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
          name: 'Authorization',
          description: 'Notion API キーを入力してください（Bearerは自動で追加されます）',
          in: 'header',
        },
        'bearer'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();

    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  return server(req, res);
};

