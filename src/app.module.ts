import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import * as mongooseAutopopulate from 'mongoose-autopopulate';
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
import * as mongoosePaginate from 'mongoose-paginate-v2';

import appConfig from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { NetmapsModule } from './netmaps/netmaps.module';
import { ChannelsModule } from './channels/channels.module';
import { MailboxesModule } from './mailboxes/mailboxes.module';
import { IpaddressesModule } from './ipaddresses/ipaddresses.module';
import { InspectorsModule } from './inspectors/inspectors.module';
import { OnmapsModule } from './onmaps/onmaps.module';
import { PingsModule } from './pings/pings.module';
import { RequestsModule } from './requests/requests.module';
import { CompaniesModule } from './companies/companies.module';
import { BranchesModule } from './branches/branches.module';
import { EnterprisesModule } from './enterprises/enterprises.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { UnitsModule } from './units/units.module';
import { LocationsModule } from './locations/locations.module';
import { FiltersModule } from './filters/filters.module';
import { NoticesModule } from './notices/notices.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ReportsModule } from './reports/reports.module';
import { SystoolsModule } from './systools/systools.module';
import { SyslogsModule } from './syslogs/syslogs.module';
import { TasksModule } from './tasks/tasks.module';
import { FtpclientModule } from './ftpclient/ftpclient.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig]
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongoURI'),
        connectionFactory: connection => {
          connection.plugin((schema: Schema) => {
            schema.set('autoCreate', false);
            schema.set('versionKey', false);
            schema.set('timestamps', true);
            schema.virtual('id').get(function () {
              return this._id;
            });
            schema.set('toJSON', {
              virtuals: true,
              transform: function (doc, ret) {
                delete ret._id;
              }
            });
            schema.set('toObject', {
              virtuals: true,
              transform: function (doc, ret) {
                delete ret._id;
              }
            });
          });
          connection.plugin(mongooseAutopopulate);
          connection.plugin(mongooseAggregatePaginate);
          connection.plugin(mongoosePaginate);

          return connection;
        }
      })
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    ChannelsModule,
    IpaddressesModule,
    MailboxesModule,
    RequestsModule,
    NetmapsModule,
    InspectorsModule,
    OnmapsModule,
    PingsModule,
    NoticesModule,
    CompaniesModule,
    BranchesModule,
    EnterprisesModule,
    DepartmentsModule,
    PositionsModule,
    LocationsModule,
    UnitsModule,
    FiltersModule,
    StatisticsModule,
    ReportsModule,
    SystoolsModule,
    SyslogsModule,
    TasksModule,
    FtpclientModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: '/notices', method: RequestMethod.GET },
        { path: '/syslogs', method: RequestMethod.GET },
        { path: '/reports/:params', method: RequestMethod.GET },
        { path: '/systools/:params', method: RequestMethod.GET },
        { path: '/auth/:params', method: RequestMethod.GET },
        { path: '/auth/:params', method: RequestMethod.POST }
      )
      .forRoutes('*');
  }
}
