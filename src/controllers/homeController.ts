import * as express from 'express';
const HALSerializer = require( 'hal-serializer')
import { ControllerBase } from './controllerBase';

export class HomeController extends ControllerBase {
  public path;
  public router = express.Router();

  constructor(path: string) {
    super();
    this.path = path;
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/`, async (req, res) => {
      await this.homeControllerAsync(req, res);
    });
  }

  async homeControllerAsync(req: any, res: any) {
    const baseUrl = req.apiUrls.baseUrl;

    const serializer = new HALSerializer();
    serializer.register('home', {
      links: (record: any) => {
        return {
          api: `${baseUrl}/`,
          spec: `${baseUrl}/swagger`,
          doc: `${baseUrl}/doc`,
        };
      },
    });
    const serialized = serializer.serialize('home', { version: `v1.0` });

    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
