import * as express from 'express';
import { ClientDef } from '../models/clientDef';
import { ClientDefRepository } from '../repositories/clientDefRepository';
import { ClientDefQuery } from '../services/clientDefQuery';
import { ControllerBase } from './controllerBase';

export class ClientDefController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  clientDefRepository: ClientDefRepository;
  clientQuery: ClientDefQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.clientDefRepository = new ClientDefRepository(db);
    this.clientQuery = new ClientDefQuery(db);
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/`, async (req, res, next) => {
      try {
        await this.getListAsync(req, res);
      } catch (error) {
        res.sendStatus(500);
        next(error); // eslint-disable-line callback-return
      }
    });

    // list the client for given symbol
    this.router.get(`${this.path}/:id`, async (req, res, next) => {
      try {
        await this.getDetailAsync(req, res);
      } catch (error) {
        res.sendStatus(500);
        next(error); // eslint-disable-line callback-return
      }
    });
  }

  async getListAsync(req: any, res: any) {
    const clients = await this.clientDefRepository.getListAsync();
    const serialized = ClientDef.serializeCollection(req, clients);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const client = await this.clientQuery.getDetailAsync(clientId, req);
    const serialized = ClientDef.serialize(req, client);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
