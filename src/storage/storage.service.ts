import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, extname, normalize } from 'path';
import {
  ReadStream,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  unlinkSync,
  promises
} from 'fs';

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  private isStorage(): boolean {
    const storagePath = this.configService.get<string>('STORAGE_PATH');
    return !!storagePath;
  }

  private getFullPath(path: string): string {
    const storagePath = this.configService.get<string>('STORAGE_PATH');
    return join(storagePath, path);
  }

  private isPathInsideStorage(path: string): boolean {
    const storagePath = this.configService.get<string>('STORAGE_PATH');
    const fullPath = this.getFullPath(path);
    return fullPath.startsWith(storagePath);
  }

  private saveFile(file: Express.Multer.File, filePath: string): Promise<void> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    return new Promise((resolve, reject) => {
      const fileStream = createWriteStream(filePath);

      fileStream.on('error', error => reject(error));
      fileStream.on('finish', () => resolve());

      fileStream.write(file.buffer);
      fileStream.end();
    });
  }

  async files(path: string): Promise<Record<string, any>[]> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    const fullPath = this.getFullPath(path);

    if (!this.isPathInsideStorage(path)) {
      throw new BadRequestException('Invalid path');
    }

    if (!existsSync(fullPath) || !statSync(fullPath).isDirectory()) {
      throw new NotFoundException('Not found');
    }

    const files = await promises.readdir(fullPath);

    return await Promise.all(
      files.map(async file => {
        const stats = await promises.stat(join(fullPath, file));
        return {
          name: file,
          type: stats.isDirectory() ? 'directory' : 'file',
          size: stats.size,
          extension: extname(file),
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
    );
  }

  async download(path: string, filename: string): Promise<ReadStream> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    const filePath = this.getFullPath(normalize(`${path}/${filename}`));

    if (!this.isPathInsideStorage(path)) {
      throw new BadRequestException('Invalid path');
    }

    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      throw new NotFoundException('File not found');
    }

    return createReadStream(filePath);
  }

  async uploadFiles(path: string, files: Express.Multer.File[]): Promise<string[]> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    const uploadedFiles: string[] = [];

    const fullPath = this.getFullPath(path);

    if (!this.isPathInsideStorage(path)) {
      throw new BadRequestException('Invalid path');
    }

    if (!existsSync(fullPath) || !statSync(fullPath).isDirectory()) {
      throw new NotFoundException('Not found');
    }

    for (const file of files) {
      const filePath = join(fullPath, file.originalname);
      uploadedFiles.push(file.originalname);
      await this.saveFile(file, filePath);
    }

    return uploadedFiles;
  }

  async uploadFolder(path: string): Promise<void> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    const fullPath = this.getFullPath(path);

    if (existsSync(fullPath)) {
      throw new BadRequestException('Directory already exists');
    }

    mkdirSync(fullPath, { recursive: true });
  }

  async rename(path: string, newPath: string): Promise<void> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    if (!this.isPathInsideStorage(path)) {
      throw new BadRequestException('Invalid path');
    }

    const oldFilePath = this.getFullPath(path);

    if (!existsSync(oldFilePath)) {
      throw new NotFoundException('Not found');
    }

    const newFilePath = this.getFullPath(newPath);

    return renameSync(oldFilePath, newFilePath);
  }

  async remove(path: string): Promise<void> {
    if (!this.isStorage()) {
      throw new NotFoundException('Starage Not found');
    }

    if (!this.isPathInsideStorage(path)) {
      throw new BadRequestException('Invalid path');
    }

    const filePath = this.getFullPath(path);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Not found');
    }

    return unlinkSync(filePath);
  }
}
