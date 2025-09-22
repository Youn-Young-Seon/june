import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadConsumer } from './upload.consumer';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-upload',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadConsumer, PrismaService],
})
export class UploadModule {}