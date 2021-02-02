import { ControllerBase } from './controllerBase';
export declare class BaseController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(path: string);
    intializeRoutes(): void;
    baseControllerAsync(req: any, res: any): Promise<void>;
}
