import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './models/event.model';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';

@Module({
  imports: [SequelizeModule.forFeature([Event])],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
