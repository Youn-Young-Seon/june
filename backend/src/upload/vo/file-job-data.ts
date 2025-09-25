export interface FileJobData {
  originalname: string;
  filename: string;
  path: string;
  size: number;
  lastModified: number;
  dstPath: string;
  createdDate: Date;
  failCheck: boolean;
}