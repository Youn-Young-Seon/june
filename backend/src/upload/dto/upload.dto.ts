import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class UploadChunkDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsNumberString()
  index: string;

  @IsNumberString()
  totalChunks: string;
}

export class UploadCompleteDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;
}
