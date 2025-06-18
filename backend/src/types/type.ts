import 'express';

declare module 'express' {
  interface User {
    userId: string;
    username: string;
  }

  export interface Request {
    user?: User;
  }
}
