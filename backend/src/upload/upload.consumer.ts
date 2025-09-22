import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Processor('file-upload')
export class UploadConsumer extends WorkerHost {
  private readonly logger = new Logger(UploadConsumer.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>) {
    let progress = 0;

    for (const chunk of splitFileToChunks(job.data.path)) {
      await uploadChunk(chunk);
      progress += chunk.size;

      await job.updateProgress(
        Math.round((progress / job.data.totalSize) * 100),
      );
    }

    return { status: 'success' };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed:`, err);
  }
}