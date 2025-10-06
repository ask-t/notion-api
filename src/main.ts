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

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 アプリケーションが http://localhost:${port} で起動しました`);
  console.log(`📚 Swagger UI は http://localhost:${port}/api で利用できます`);
}

// 開発環境ではbootstrapを実行
if (require.main === module) {
  bootstrap();
}
