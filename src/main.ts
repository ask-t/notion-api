import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3001);
  console.log('🚀 アプリケーションが http://localhost:3001 で起動しました');
  console.log('📚 Swagger UI は http://localhost:3001/api で利用できます');
}
bootstrap();
