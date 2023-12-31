import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Enterprise } from './schemas/enterprise.schema';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Injectable()
export class EnterprisesService {
  constructor(@InjectModel(Enterprise.name) private readonly enterpriseModel: Model<Enterprise>) {}

  async create(createEnterpriseDto: CreateEnterpriseDto): Promise<Enterprise> {
    try {
      return await this.enterpriseModel.create(createEnterpriseDto);
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('A record with the same name already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Enterprise[]> {
    return await this.enterpriseModel.find().select({ createdAt: 0, updatedAt: 0 }).exec();
  }

  async findOneById(id: string): Promise<Enterprise> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record ID');
    }
    const enterprise = await this.enterpriseModel.findById(id).exec();
    if (!enterprise) {
      throw new NotFoundException('Record not found');
    }
    return enterprise;
  }

  async updateOneById(id: string, updateEnterpriseDto: UpdateEnterpriseDto): Promise<Enterprise> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record ID');
    }
    try {
      const updatedEnterprise = await this.enterpriseModel
        .findByIdAndUpdate(id, { $set: updateEnterpriseDto }, { new: true })
        .exec();
      if (!updatedEnterprise) {
        throw new NotFoundException('Record not found');
      }
      return updatedEnterprise;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('A record with the same name already exists');
      }
      throw error;
    }
  }

  async removeOneById(id: string): Promise<Enterprise> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record ID');
    }
    const deletedEnterprise = await this.enterpriseModel.findByIdAndRemove(id).exec();
    if (!deletedEnterprise) {
      throw new NotFoundException('Record not found');
    }
    return deletedEnterprise;
  }
}
