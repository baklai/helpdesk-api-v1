import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { AggregatePaginateResult } from 'mongoose';

import { InspectorsService } from './inspectors.service';
import { Inspector } from './schemas/inspector.schema';
import { InspectorDto } from './dto/inspector.dto';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { UpdateInspectorDto } from './dto/update-inspector.dto';
import { PaginateInspectorDto } from './dto/paginate-inspector.dto';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiTags('Inspectors')
@Controller('inspectors')
export class InspectorsController {
  constructor(private readonly inspectorService: InspectorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inspector' })
  @ApiCreatedResponse({ description: 'Inspector created successfully', type: InspectorDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() createChannelDto: CreateInspectorDto): Promise<Inspector> {
    return await this.inspectorService.create(createChannelDto);
  }

  @Get()
  @ApiBearerAuth('JWT Guard')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get all inspectors' })
  @ApiOkResponse({ description: 'Success', type: PaginateInspectorDto })
  async findAll(@Query() query: PaginateQueryDto): Promise<AggregatePaginateResult<Inspector>> {
    return await this.inspectorService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT Guard')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get a inspector by ID' })
  @ApiOkResponse({ description: 'Success', type: InspectorDto })
  @ApiNotFoundResponse({ description: 'Inspector not found' })
  @ApiBadRequestResponse({ description: 'Invalid inspector ID' })
  async findOneById(@Param('id') id: string): Promise<Inspector> {
    return await this.inspectorService.findOneById(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT Guard')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update a inspector by ID' })
  @ApiOkResponse({ description: 'Inspector updated successfully', type: InspectorDto })
  @ApiNotFoundResponse({ description: 'Inspector not found' })
  @ApiBadRequestResponse({ description: 'Invalid inspector ID' })
  async updateOneById(@Param('id') id: string, @Body() updateInspectorDto: UpdateInspectorDto): Promise<Inspector> {
    return await this.inspectorService.updateOneById(id, updateInspectorDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT Guard')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Delete a inspector by ID' })
  @ApiOkResponse({ description: 'Inspector deleted successfully', type: InspectorDto })
  @ApiNotFoundResponse({ description: 'Inspector not found' })
  @ApiBadRequestResponse({ description: 'Invalid inspector ID' })
  async removeOneById(@Param('id') id: string): Promise<Inspector> {
    return await this.inspectorService.removeOneById(id);
  }
}
