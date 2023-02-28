import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '../models/event.model';
import { QueryParams } from '../../global/interfaces/query-params.interface';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { QueryParamsBuilder } from '../../global/utils/query-params-builder.util';
import {
  IPaginate,
  ServicePaginate,
} from '../../global/interfaces/service-paginate.interface';
import { existsSync, unlinkSync } from 'fs';
import { Op } from 'sequelize';
import { Request } from 'express';
import { TokenPayload } from 'src/global/interfaces/token-payload.interface';

@Injectable()
export class EventService {
  private _user: TokenPayload;

  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  prepare(req: Request): EventService {
    this._user = req['user'];
    return this;
  }

  async listEvents(params: QueryParams): Promise<ServicePaginate<Event[]>> {
    const searchFields = ['eventName', 'location'];
    const validOrderFields = ['id', 'eventName', 'location', 'date', 'time'];
    const queryObject = QueryParamsBuilder.extract(
      params,
      searchFields,
      validOrderFields,
    );

    queryObject['attributes'] = { exclude: ['createdBy'] };
    queryObject['where'] = { createdBy: this._user.id };
    const events = await this.eventModel.findAndCountAll(queryObject);
    const pagination: IPaginate = {
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      search: params.search || '',
      order: params.order || '',
      orderBy: params.orderBy || '',
      total: events.count,
    };

    return {
      items: events.rows,
      pagination: pagination,
    };
  }

  async findEvent(id: number, excludeColumn: string[] = null): Promise<Event> {
    return await this.eventModel.findOne({
      where: { id: id, createdBy: this._user.id },
      attributes: { exclude: excludeColumn ?? ['createdBy'] },
    });
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new Event();
    newEvent.eventName = createEventDto.eventName;
    newEvent.date = new Date(createEventDto.date);
    newEvent.time = createEventDto.time;
    newEvent.location = createEventDto.location;
    newEvent.image = createEventDto.image;
    newEvent.createdBy = Number(this._user.id);
    const createdEvent = await newEvent.save().catch((err) => {
      throw new InternalServerErrorException(err);
    });
    delete createdEvent.createdBy;
    return createdEvent;
  }

  async updateEvent(
    eventId: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findEvent(eventId);
    if (!event) throw new NotFoundException('event not found');
    unlinkSync('./' + event.image);
    event.eventName = updateEventDto.eventName;
    event.date = new Date(updateEventDto.date);
    event.time = updateEventDto.time;
    event.location = updateEventDto.location;
    event.image = updateEventDto.image;
    const updatedEvent = await event.save().catch((err) => {
      throw new InternalServerErrorException(err);
    });
    delete updatedEvent.createdBy;
    return updatedEvent;
  }

  async deleteEvents(eventId: number[]): Promise<Event[]> {
    const events = await this.eventModel.findAll({
      where: {
        id: {
          [Op.or]: eventId,
        },
      },
    });
    if (!events || events.length === 0)
      throw new NotFoundException('event not found');
    for (const event of events) {
      const img = './' + event.image;
      delete event.createdBy;
      if (existsSync(img)) unlinkSync(img);
      await event.destroy().catch((err) => {
        throw new InternalServerErrorException(err);
      });
    }

    return events;
  }
}
