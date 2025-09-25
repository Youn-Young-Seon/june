import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { extname, join } from 'path';
import * as fs from 'fs'
import { Upload } from './entities/upload.entity';
import { FileJobData } from './vo/file-job-data';

@Processor('file-upload')
export class UploadConsumer extends WorkerHost {
  private readonly logger = new Logger(UploadConsumer.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<FileJobData, any, string>) {
    const { originalname, path, lastModified } = job.data;

    const dstPath = await this.moveFile(path, `${join(process.env.UPLOAD_PATH, originalname)}`);
    const createdDate = new Date(Number(lastModified)) ?? new Date(Date.now());

    job.data.dstPath = dstPath;
    job.data.createdDate = createdDate;

    return { status: 'success' };
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<FileJobData, any, string>) {
    const uploadData = new Upload(job.data);
    await this.uploadDataSave(uploadData);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<FileJobData, any, string>, err: Error) {
    if (err) {
      this.logger.error(`Job failed: ${JSON.stringify(job.data)} with error ${err.message}`);
      const uploadData = new Upload(job.data);
      await this.uploadDataSave(uploadData);
    }
  }

  private async uploadDataSave(data: Upload) {
    await this.prisma.mediaFile.create({
      data: { ...data },
    });
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