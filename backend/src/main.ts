import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './config/winston.config';
import * as ffmpeg from '@ffmpeg-installer/ffmpeg';
import * as ffmpegFluent from 'fluent-ffmpeg';
import * as ffprobe from 'ffprobe-static';

ffmpegFluent.setFfmpegPath(ffmpeg.path);
ffmpegFluent.setFfprobePath(ffprobe.path);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:4200', 'http://172.30.1.45:4200', 'http://127.0.0.1:4200', 'http://june-frontend:4200'],
    credentials: true,
  });
  
  await app.listen(5000, "0.0.0.0");
}
bootstrap();
