import { JwtPayload } from "jsonwebtoken";

export interface IRequestResponse<data = unknown, error = unknown> {
  status: STATUS
  message: string;
  data?: data;
  errors?: error;
}

type STATUS = 100 | 101 | 102 | 200 | 201 | 202 | 400 | 401 | 402 | 403 | 404 | 415 | 500;

export interface IJwtSingin {
  sub: string; 
  expirateNumber: number; 
  expirateTime: 'seconds' | 'minutes' | 'hours';
}

export interface IConfigurationEmail {
  from?: string;
  to: string;
  subject: string;
  cc?: string;
  text?: string;
  html?: string;
}

export interface IValidateToken {
  status: boolean;
  payload?: JwtPayload
}