import { IncomingMessage } from 'http';

declare global {
  namespace Express {
    interface Request extends IncomingMessage {
      rawBody?: Buffer;
    }
  }
}
