import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Logger,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    @InjectQueue('file-upload') private readonly fileQueue: Queue,
  ) { }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 1000, {
    storage: diskStorage({
      destination: join(process.env.TMP_PATH),
    }),
  }))
  async uploadChunk(@UploadedFiles() files: Express.Multer.File[]) {
    const jobs = await Promise.allSettled(
      files.map(file => {
        this.logger.log(`file: ${JSON.stringify(file)}`);
        return this.fileQueue.add('upload', {
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
        })
      })
    );
    return jobs;
  }

  @Get('job/progress/:jobId')
  async getJobProgress(@Param('jobId') jobId: string) {
    const job = await this.fileQueue.getJob(jobId);

    if (!job) {
      return { progress: null, state: 'notfound' };
    }

    const state = await job.getState();
    // 완료되었거나 실패한 경우, 최종 상태와 함께 progress 100을 반환하여 폴링을 멈추도록 유도
    if (state === 'completed' || state === 'failed') {
      return { progress: 100, state };
    }

    return { progress: job.progress, state };
  }
}