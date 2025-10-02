import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Logger,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadRequestDto } from './dto/upload-request.dto';
import { Util } from 'src/utils/util';

@Controller('upload')
export class UploadController {  
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    @InjectQueue('file-upload') private readonly fileQueue: Queue,
  ) { }

  @Post('multiple')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.env.TMP_PATH),
    }),
    fileFilter: (req, file, cb) => {
      if (!Util.allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, false);
      }
      cb(null, true);
    },
  }))
  async uploadChunk(@UploadedFile() file: Express.Multer.File, @Body() body: UploadRequestDto) {
    const reqFileData = {
      originalname: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      filename: file.filename,
      path: file.path,
      size: file.size,
      lastModified: body.lastModified,
    }

    this.logger.log(JSON.stringify(reqFileData));

    const validCheck = await this.uploadService.invalidateFile(reqFileData);

    if (!validCheck) {
      return { message: 'File already exists' };
    }

    return await this.fileQueue.add('upload', reqFileData);
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