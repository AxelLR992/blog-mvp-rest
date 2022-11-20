import { UploadedFile } from "express-fileupload";

abstract class AbstractService<T> {
  get(): Promise<T[]> {
    throw new Error("Method not implemented");
  }

  getById(id: number): Promise<T> {
    throw new Error("Method not implemented");
  }

  create(data: T | UploadedFile): Promise<T> {
    throw new Error("Method not implemented");
  }

  update(data: T, id: number): Promise<T> {
    throw new Error("Method not implemented");
  }

  delete(id: number): Promise<T> {
    throw new Error("Method not implemented");
  }
}

export default AbstractService;