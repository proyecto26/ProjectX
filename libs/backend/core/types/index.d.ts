import { AuthUser } from '../src/lib/user/user.interface';

declare namespace Express {
  export interface Request {
    user?: AuthUser;
  }
}

declare module 'express' {
  export interface Request {
    user?: AuthUser;
  }
}
