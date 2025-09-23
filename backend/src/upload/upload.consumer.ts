import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as fs from 'fs'
import { extname, join } from 'path';

@Processor('file-upload')
export class UploadConsumer extends WorkerHost {
  private readonly logger = new Logger(UploadConsumer.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>) {
    let progress = 0;
    const { originalname, filename, path, size } = job.data;

    this.logger.log(`originalname: ${originalname}`);
    this.logger.log(`filename: ${filename}`);
    this.logger.log(`path: ${path}`);
    this.logger.log(`size: ${size}`);
    this.logger.log(`ext: ${extname(originalname)}`);

    const resultPath = await this.moveFile(path, `${join(process.env.UPLOAD_PATH, filename)}`);
    this.logger.log(`resultPath: ${resultPath}`);

    return { status: 'success' };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    
  }

  private moveFile(srcPath: string, destPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const readable = fs.createReadStream(srcPath);
      const writable = fs.createWriteStream(destPath);

      readable.pipe(writable);

      writable.on('finish', () => {
        // 복사 완료 후 원본 파일 삭제
        fs.unlink(srcPath, err => {
          if (err) reject(err);
          else resolve(destPath);
        });
      });

      writable.on('error', reject);
      readable.on('error', reject);
    });
  }
}