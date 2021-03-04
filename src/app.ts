import * as log4js from 'log4js';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as firebase from 'firebase-admin';
import { initControllers } from './controllers/init';
import * as path from 'path';
const serviceAccount = require('../permissions.json');

// extend the express Request to carry custom data to the controllers
declare global {
  namespace Express {
    interface Request {
      apiUrls?: any;
    }
  }
}

export class App {
  app: express.Application;
  db: FirebaseFirestore.Firestore;
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // setup firebase access
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        //databaseURL: 'https://hedbot.firebaseio.com',
      });
    }

    // setup simple logging configuration
    log4js.configure({
      appenders: {
        console: { type: 'console' },
      },
      categories: { default: { appenders: ['console'], level: 'debug' } },
    });

    this.app = express();
    this.db = firebase.firestore();

    this.setupMiddleware();
    this.setupControllers();
    this.setupStatic();
  }

  private setupMiddleware() {
    // simple middleware to set config base based on the incoming request.
    // (don't know how to get it before that). Used in serializers to generate
    // resource links
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      // note: a bit touchy here to make it work with both google cloud functions
      // nad the emulator. The "baseUrl" is empty in google cloud functions.
      // const expressBase = req.baseUrl ? req.baseUrl : '/exchangeHandler'

      let proto;
      const forwardedProto = req.headers['X-Forwarded-Proto'];
      if (forwardedProto) {
        proto = forwardedProto as string;
      } else {
        proto = req.secure ? 'https:' : 'http:';
      }

      const expressBase = req.baseUrl;
      const url = proto + '//' + req.headers.host + expressBase;
      const baseUrl = url + this.baseUrl;
      const requestUrl = req.url === '/' ? '' : req.url;
      const selfUrl = `${proto}//${req.headers.host}${requestUrl}`;

      req.apiUrls = {
        baseUrl,
        requestUrl,
        selfUrl,
        appBase: expressBase.slice(1),
        proto,
        host: req.headers.host,
      };

      next();
    });

    const corsWithOpts = cors({ origin: true }); // HACK to control error error
    this.app.use(corsWithOpts);

    this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private setupControllers() {
    initControllers(this.baseUrl, this.app, this.db);
  }

  private setupStatic() {
    const thePath = path.join(__dirname, '../bin/spec');
    this.app.use('/eliza/api/spec', express.static(thePath));

    const swaggerPath = path.join(__dirname, '../bin/swagger-ui-dist');
    this.app.use('/eliza/api/swagger', express.static(swaggerPath));

    const docPath = path.join(__dirname, '../bin/doc/index.htm');
    this.app.use('/eliza/api/doc', express.static(docPath));
  }
}
