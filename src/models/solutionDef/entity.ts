import { serialize, serializeCollection } from './serializer';

export class SolutionDef {
  static serialize(req: any, data: any) {
    return serialize(req, data);
  }

  static serializeCollection(req: any, data: any) {
    return serializeCollection(req, data);
  }
}
