import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../common/prisma.service';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectQueue('file-upload') private readonly fileQueue: Queue,
    private readonly prisma: PrismaService,
  ) { }

  async invalidateFile(fileData: any): Promise<boolean> {
    const fileDate = new Date(Number(fileData.lastModified)) ?? new Date(Date.now());
    const year = fileDate.getFullYear();
    const month = String(fileDate.getMonth() + 1).padStart(2, '0')

    const result = await this.prisma.mediaFile.findFirst({
      where: {
        yearFolder: year,
        monthFolder: month,
        filename: fileData.originalname,
      }
    });

    if (result) {
      fs.unlink(fileData.path, err => {
        if (err) throw new Error(err.message);
      });

      return false;
    }
    
    return true;
  }
}
