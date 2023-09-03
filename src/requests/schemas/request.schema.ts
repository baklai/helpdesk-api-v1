import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from '../../users/schemas/user.schema';
import { Location } from '../../locations/schemas/location.schema';
import { Position } from '../../positions/schemas/position.schema';
import { Company } from '../../companies/schemas/company.schema';
import { Branch } from '../../branches/schemas/branch.schema';
import { Enterprise } from '../../enterprises/schemas/enterprise.schema';
import { Department } from '../../departments/schemas/department.schema';

export type RequestDocument = HydratedDocument<Request>;

@Schema()
export class Request {
  @Prop({ type: String, required: true, trim: true })
  fullname: string;

  @Prop({ type: String, required: true, trim: true })
  phone: string;

  @Prop({ type: String, trim: true })
  ipaddress?: string;

  @Prop({ type: String, trim: true })
  mail?: string;

  @Prop({ type: String, required: true, trim: true })
  request: string;

  @Prop({ type: Date, trim: true })
  closed?: Date;

  @Prop({ type: String, trim: true })
  comment?: string;

  @Prop({ type: String, trim: true })
  conclusion?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    autopopulate: true
  })
  workerOpen: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  })
  workerClose: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    trim: true,
    autopopulate: true
  })
  position?: Position;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    trim: true,
    autopopulate: true
  })
  location?: Location;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    trim: true,
    autopopulate: true
  })
  company?: Company;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    trim: true,
    autopopulate: true
  })
  branch?: Branch;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enterprise',
    trim: true,
    autopopulate: true
  })
  enterprise?: Enterprise;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    trim: true,
    autopopulate: true
  })
  department?: Department;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
