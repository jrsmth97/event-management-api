import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { HttpResponse } from '../../global/interfaces/http-response.interface';
import { ResponseBuilder } from '../../global/utils/response-builder.util';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponse({
  description: 'Unauthorized Error. Please check your credentials',
})
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error. Check error log for detail information',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Success Register',
  })
  public async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    const register = await this.authService.registerUser(registerDto);
    return res
      .status(HttpStatus.CREATED)
      .send(
        ResponseBuilder.SuccessResponse(
          'Success register user',
          HttpStatus.OK,
          register,
        ),
      );
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success Login' })
  public async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<Response<HttpResponse>> {
    const login = await this.authService.login(loginDto);
    return res.send(
      ResponseBuilder.SuccessResponse('Success login', HttpStatus.OK, login),
    );
  }
}
