import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ScopesGuard } from 'src/common/guards/scopes.guard';
import { Scopes } from 'src/common/decorators/scopes.decorator';
import { Scope } from 'src/common/enums/scope.enum';
import { EventsService } from './events.service';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';

@ApiTags('Events')
@Controller('events')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, ScopesGuard)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  @Scopes(Scope.EventCreate)
  @ApiOperation({
    summary: 'Create new record',
    description: 'Required scopes: [' + [Scope.EventCreate].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Success', type: Event })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ description: 'Request body object', type: CreateEventDto })
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventService.create(createEventDto);
  }

  @Get()
  @Scopes(Scope.EventRead)
  @ApiOperation({
    summary: 'Get all records',
    description: 'Required scopes: [' + [Scope.EventRead].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Success', type: [Event] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async findAll(@Query() query: QueryEventDto): Promise<Event[]> {
    return await this.eventService.findAll(query);
  }

  @Get(':id')
  @Scopes(Scope.EventRead)
  @ApiOperation({
    summary: 'Get record by ID',
    description: 'Required scopes: [' + [Scope.EventRead].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Success', type: Event })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiParam({ name: 'id', description: 'The ID of the record', type: String })
  async findOneById(@Param('id') id: string): Promise<Event> {
    return await this.eventService.findOneById(id);
  }

  @Put(':id')
  @Scopes(Scope.EventUpdate)
  @ApiOperation({
    summary: 'Update record by ID',
    description: 'Required scopes: [' + [Scope.EventUpdate].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Success', type: Event })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiParam({ name: 'id', description: 'The ID of the record', type: String })
  @ApiBody({ description: 'Request body object', type: UpdateEventDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return await this.eventService.updateOneById(id, updateEventDto);
  }

  @Delete(':id')
  @Scopes(Scope.EventDelete)
  @ApiOperation({
    summary: 'Delete record by ID',
    description: 'Required scopes: [' + [Scope.EventUpdate].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Success', type: Event })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiParam({ name: 'id', description: 'The ID of the record', type: String })
  async removeOneById(@Param('id') id: string): Promise<Event> {
    return await this.eventService.removeOneById(id);
  }
}
