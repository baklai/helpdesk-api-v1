import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Notice } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Injectable()
export class NoticesService {
  constructor(@InjectModel(Notice.name) private readonly noticeModel: Model<Notice>) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    return await this.noticeModel.create(createNoticeDto);
  }

  async findAll(userId: string): Promise<Notice[]> {
    return await this.noticeModel.find({ userId }).exec();
  }

  async removeOneById(id: string, userId: string): Promise<Notice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid notice ID');
    }
    const deletedNotice = await this.noticeModel.findOneAndRemove({ _id: id, userId }).exec();
    if (!deletedNotice) {
      throw new NotFoundException('Notice not found');
    }
    return deletedNotice;
  }
}
