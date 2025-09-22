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
    destination: join(process.env.UPLOAD_PATH),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
}))
async uploadChunk(@UploadedFiles() files: Express.Multer.File[]) {
  const jobs = await Promise.allSettled(
    files.map(file => 
      this.fileQueue.add('upload', {
        filename: file.filename, // Multer가 생성한 유니크 파일명
        path: file.path,         // Multer가 저장한 실제 파일 경로
        size: file.size,
      }),
    ),
  );
  this.logger.log(`jobs: ${JSON.stringify(jobs)}`);
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