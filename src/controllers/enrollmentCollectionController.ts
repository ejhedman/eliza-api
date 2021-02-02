import * as express from 'express';
// import { Request, Response } from 'express'
import { Enrollment } from '../models/enrollment';
import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { EnrollmentQuery } from '../services/enrollmentQuery';
import { ControllerBase } from './controllerBase';

export class EnrollmentCollectionController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  enrollmentRepository: EnrollmentRepository;
  enrollmentQuery: EnrollmentQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.enrollmentRepository = new EnrollmentRepository(db);
    this.enrollmentQuery = new EnrollmentQuery(db);
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

    // list the Enrollment for given symbol
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
    const clientId = req.params.clientId
    const filter = req.query;
    const enrollments = await this.enrollmentRepository.getListAsync(clientId, filter);
    const serialized = Enrollment.serializeCollection(req, enrollments);
    // serialized.links.home = `${req.apiUrls.baseUrl}`;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const enrollmentId = req.params.id;
    const enrollment = await this.enrollmentQuery.getDetailAsync(clientId, enrollmentId, req);
    const serialized = Enrollment.serialize(req, enrollment);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
