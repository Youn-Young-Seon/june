import * as crypto from "crypto";
import * as fs from "fs/promises";
import { extname } from "path";

export async function generateFileName(filePath: string, originalName: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const ext = extname(originalName);
    return `${hash}${ext}`;
}