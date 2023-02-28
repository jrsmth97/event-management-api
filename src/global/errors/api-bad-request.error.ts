import { BadRequestException } from '@nestjs/common';
// import { ResponseBuilder } from '../utils/response-builder.util';

export class ApiBadRequest extends BadRequestException {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message ?? this.message;
  }
}
