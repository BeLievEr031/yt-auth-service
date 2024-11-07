import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { morganStream } from './utils';
import { authRouter, userRouter } from './routes';
import { HttpError } from 'http-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Config from './config/config';
import bidRouter from './routes/bid.route';
import workerRouter from './routes/worker.route';
import fileUpload from 'express-fileupload';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://your-client-app-url.com'],
    credentials: true,
  }),
);

app.use(fileUpload());
app.use(morgan('tiny', { stream: morganStream }));

app.use(express.json({ limit: '1MB' }));
app.use(express.urlencoded({ extended: true, limit: '1MB' }));
app.use(express.static('public'));
app.use(cookieParser());
// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/bid', bidRouter);
app.use('/api/v1/worker', workerRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        statusCode,
        type: err.name,
        msg: err.message,
        url: req.url,
        ip: req.ip,
        success: false,
        stack: Config.NODE_ENV === 'production' ? null : err.stack,
      },
    ],
  });
});
export default app;
