import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../user/models/user.model';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dtos/login.dto';
import { StringUtil } from '../../global/utils/string.util';
import { TokenPayload } from '../../global/interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '../../global/interfaces/login-response.interface';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    let user: User;
    if (StringUtil.isEmail(loginDto.identity)) {
      user = await this.findUserByEmail(loginDto.identity);
    } else {
      user = await this.findUserByUsername(loginDto.identity);
    }

    if (!user) throw new ForbiddenException('Username or password is wrong');
    const pass = await bcrypt.compare(loginDto.password, user.password);
    if (!pass) throw new ForbiddenException('Username or password is wrong');

    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    };

    return {
      ...tokenPayload,
      access_token: this.generateToken(tokenPayload),
    };
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async registerUser(registerDto: RegisterDto): Promise<User> {
    const user = new User();
    user.name = registerDto.name;
    user.username = registerDto.username;
    user.email = registerDto.email;

    const salt = await bcrypt.genSalt(11);
    registerDto.password = await bcrypt.hash(registerDto.password, salt);
    user.password = registerDto.password;
    return await this.createUser(user);
  }

  async createUser(user: User): Promise<User> {
    const userSaved = await user.save().catch((err) => {
      throw new InternalServerErrorException(err);
    });
    delete userSaved.password;
    return userSaved;
  }

  generateToken(payload: TokenPayload): string {
    const ttl = process.env.JWT_TTL || '120m';
    return this.jwtService.sign(payload, { expiresIn: ttl });
  }
}
