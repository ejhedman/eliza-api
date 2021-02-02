import { ControllerBase } from './controllerBase';
export declare class HomeController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(path: string);
    intializeRoutes(): void;
    homeControllerAsync(req: any, res: any): Promise<void>;
}
