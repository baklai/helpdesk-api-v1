import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { MongoSchemaDto } from 'src/common/dto/mongosee-schema.dto';

export class CompanyDto extends MongoSchemaDto {
  @ApiProperty({
    description: 'The name of the company (must be unique)',
    example: 'ABC Corporation'
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({
    description: 'The address of the company',
    example: '456 Business Avenue, Townsville'
  })
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiPropertyOptional({
    description: 'A description about the company',
    example: 'A leading provider of innovative solutions.'
  })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
