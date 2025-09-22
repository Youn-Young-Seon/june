import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { join, extname } from 'path'; // extname 추가
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UploadService {

  constructor(
    @InjectQueue('file-upload') private readonly fileQueue: Queue,
    private readonly prisma: PrismaService,
  ) { }

}
