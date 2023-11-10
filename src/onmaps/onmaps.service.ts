import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types, AggregatePaginateModel, AggregatePaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

const nmap = require('libnmap');

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { Onmap } from './schemas/onmap.schema';

@Injectable()
export class OnmapsService {
  constructor(
    @InjectModel(Onmap.name) private readonly onmapModel: AggregatePaginateModel<Onmap>
  ) {}

  async create(createOnmapDto: Record<string, any>) {
    const { title, target, profile } = createOnmapDto;
    const opts = {
      json: true,
      timeout: 900,
      flags: profile,
      ports: null,
      range: [target]
    };

    nmap.scan(opts, async (err: any, report: any) => {
      if (err) {
        return new Error(err.message);
      } else {
        for (let item in report) {
          try {
            await this.onmapModel.create({
              title: title || `ONMAP Scan ${target}`,
              target: item,
              flags: opts.flags || [],
              ...report[item]
            });
          } catch (err) {
            return new Error(err.message);
          }
        }
        return true;
      }
    });
  }

  async findAll(query: PaginateQueryDto): Promise<AggregatePaginateResult<Onmap>> {
    const { offset = 0, limit = 5, sort = { updatedAt: -1 }, filters = {} } = query;

    if (filters?.updatedAt?.$gte && filters?.updatedAt?.$lt) {
      filters.updatedAt.$gte = new Date(filters?.updatedAt.$gte);
      filters.updatedAt.$lt = new Date(filters?.updatedAt.$lt);
    }

    const aggregation = [
      {
        $match: filters
      },
      {
        $addFields: {
          id: '$_id'
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          target: 1,
          updatedAt: 1
        }
      },
      { $sort: sort }
    ];

    const aggregateQuery = this.onmapModel.aggregate(aggregation);
    return await this.onmapModel.aggregatePaginate(aggregateQuery, {
      offset,
      limit: Number(limit) > 0 ? Number(limit) : await this.onmapModel.countDocuments(),
      lean: false,
      allowDiskUse: true
    });
  }

  async findOneById(id: Types.ObjectId): Promise<Onmap> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid report ID');
    }
    const report = await this.onmapModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async removeOneById(id: Types.ObjectId): Promise<Onmap> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid report ID');
    }
    const deletedInspector = await this.onmapModel.findByIdAndRemove(id).exec();
    if (!deletedInspector) {
      throw new NotFoundException('Report not found');
    }
    return deletedInspector;
  }
}