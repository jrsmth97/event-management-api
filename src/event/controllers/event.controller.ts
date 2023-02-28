import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HttpResponse } from '../../global/interfaces/http-response.interface';
import { ResponseBuilder } from '../../global/utils/response-builder.util';
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dtos/create-event.dto';
import { QueryParams } from '../../global/interfaces/query-params.interface';
import { Request, Response } from 'express';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileOptions } from '../../global/interceptors/file-option.interceptor';
import { DeleteEventDto } from '../dtos/delete-event.dto';

@Controller('events')
@ApiTags('Event')
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Unauthorized Error. Please check your credentials',
})
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error. Check error log for detail information',
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(201)
  @ApiOkResponse({
    description: 'Success Create Event',
  })
  @UseInterceptors(FileInterceptor('image', FileOptions))
  @ApiConsumes('multipart/form-data')
  public async createEvent(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    createEventDto.image = '/' + image.path;
    const created = await this.eventService
      .prepare(req)
      .createEvent(createEventDto);
    return res
      .status(HttpStatus.CREATED)
      .send(
        ResponseBuilder.SuccessResponse(
          'Success create event',
          HttpStatus.CREATED,
          created,
        ),
      );
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success List Events' })
  @ApiQuery({ name: 'orderBy', type: String, required: false })
  @ApiQuery({ name: 'order', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  public async listEvents(
    @Query() params: QueryParams,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    const result = await this.eventService.prepare(req).listEvents(params);
    return res.send(
      ResponseBuilder.SuccessResponse(
        'Success get list events',
        HttpStatus.OK,
        result,
      ),
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success Get Event' })
  public async eventDetail(
    @Param('id') eventid: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    const event = await this.eventService.prepare(req).findEvent(eventid);
    if (!event) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(
          ResponseBuilder.ErrorResponse(
            'Event not found',
            HttpStatus.NOT_FOUND,
          ),
        );
    }

    return res.send(
      ResponseBuilder.SuccessResponse(
        'Success get event',
        HttpStatus.OK,
        event,
      ),
    );
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success Update Event' })
  @UseInterceptors(FileInterceptor('image', FileOptions))
  @ApiConsumes('multipart/form-data')
  public async updateEvent(
    @Param('id') eventid: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    updateEventDto.image = '/' + image.path;
    const updateEvent = await this.eventService.updateEvent(
      eventid,
      updateEventDto,
    );
    return res.send(
      ResponseBuilder.SuccessResponse(
        'Success update event',
        HttpStatus.OK,
        updateEvent,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success Delete Event' })
  public async deleteEvent(
    @Body() deleteEventDto: DeleteEventDto,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    const deletedEvent = await this.eventService.deleteEvents(
      deleteEventDto.eventId,
    );
    return res.send(
      ResponseBuilder.SuccessResponse(
        'Success delete event',
        HttpStatus.OK,
        deletedEvent,
      ),
    );
  }
}
