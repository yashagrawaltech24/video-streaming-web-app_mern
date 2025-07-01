import type { Request, Response, NextFunction } from 'express';
import { type Application, json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from '../config/cors';

// Global Middlewares
export const registerGlobalMiddleware = (app: Application) => {
  // Common middlewares
  app.use(cors(corsOptions));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  // custom global middlewares
};

// Not-Found Handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

// Error Handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
