import { TokenPayload } from './token-payload.interface';

export interface LoginResponse extends TokenPayload {
  access_token: string;
}
