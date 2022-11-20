import { Request, Response } from "express";

abstract class AbstractController<T> {
    get(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented");
    }
    getById(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented");
    }
    post(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented");
    }
    put(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented");
    }
    delete(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented");
    }

}

export default AbstractController;