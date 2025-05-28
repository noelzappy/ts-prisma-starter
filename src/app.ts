import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT } from '@config';
import { createServer, Server } from 'http';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { jwtStrategy, passport } from './config/passport';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import bullQueues from './workers/bull-board';
import basicAuth from 'express-basic-auth';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public httpServer: Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.httpServer = createServer(this.app);

    this.app.disable('x-powered-by'); // Disable the X-Powered-By header

    this.app.set('trust proxy', 1 /* number of proxies between user and server */);

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeBullBoard();
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`🚀 App running on ${this.env} mode`);
      logger.info(`🚀 API docs are at http://localhost:${this.port}/api-docs`);
      logger.info(`🚀 Bull Board is http://localhost:${this.port}/bull-board`);
      logger.info(`Press CTRL-C to stop the server`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev', { stream }));

    // TODO: Change this to only allow the client URL in production
    this.app.use(cors({ origin: '*', credentials: true }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());

    // Parse JSON and URL-encoded data
    this.app.use(
      express.json({
        verify(req, res, buf) {
          (req as any).rawBody = buf;
        },
      }),
    );

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // jwt authentication
    this.app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);
  }

  private initializeBullBoard() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/bull-board');
    createBullBoard({
      queues: bullQueues,
      serverAdapter,
    });
    if (NODE_ENV === 'production') {
      this.app.use(
        '/bull-board',
        basicAuth({
          users: {
            [process.env.BULL_BOARD_USERNAME]: process.env.BULL_BOARD_PASSWORD,
          },
          challenge: true,
          realm: 'Bull Board',
        }),
        serverAdapter.getRouter(),
      );
    } else {
      this.app.use('/bull-board', serverAdapter.getRouter());
    }
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'API Docs',
          version: '1.0.0',
          description: 'API documentation for the application',
          contact: {
            name: 'API Support',
            url: 'http://www.example.com/support',
            email: 'example@example.com',
          },
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
