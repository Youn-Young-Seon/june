import path, { extname } from "path";
import { FileJobData } from "../vo/file-job-data";

export class Upload {
    id: number;
    failCheck: boolean;
    relativePath: string;
    filename: string;
    extension: string;
    sizeBytes: number;
    yearFolder: number;
    monthFolder: string;
    fileModifiedAt: Date;
    createdAt: Date;

    constructor(data: FileJobData) {
        this.filename = data.originalname;
        this.extension = extname(data.originalname).replace('.', '');
        this.sizeBytes = data.size;
        this.fileModifiedAt = data.createdDate;
        this.yearFolder = data.createdDate.getFullYear();
        this.monthFolder = String(data.createdDate.getMonth() + 1).padStart(2, '0');
        this.createdAt = new Date(Date.now());
        this.failCheck = data.failCheck || false;        
        this.relativePath = path.join(process.env.UPLOAD_PATH, String(this.yearFolder), this.monthFolder, this.filename);
    }
}
