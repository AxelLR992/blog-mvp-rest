import { UploadedFile } from "express-fileupload";
import Database from "../../Database";
import AbstractService from "../../models/AbstractService";
import File from "../../models/File";
import { v4 as uuid } from "uuid";

class FilesService implements AbstractService<File> {
  async get(): Promise<File[]> {
    const db = new Database();
    const res = await db.executeQuery("SELECT * FROM files");
    db.close();
    return res.map((file) => new File(file));
  }

  async getById(id: number): Promise<File> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM files WHERE file_id = " + id
    );
    db.close();
    // Return undefined when a post wasn't found
    return res[0] ? new File(res[0]) : res[0];
  }

  async create(file: UploadedFile): Promise<File> {
    // Handle file upload
    const filePath = process.env.FILES_PATH;
    if (!filePath)
      throw new Error(
        "FILES_PATH is not defined. Please define it in the .env app configuration."
      );

    const filename = uuid();
    file.mv(filePath + filename);

    // Create file in database
    const db = new Database();
    await db.executeQuery(`
        INSERT INTO files (ORIGINAL_NAME, FILE_NAME, MIME_TYPE, CREATED_AT, UPDATED_AT)
        VALUES ('${file.name}', '${filename}', '${file.mimetype}', NOW(), NOW())
    `);
    const res = await db.executeQuery(
      "SELECT * FROM files WHERE file_id = LAST_INSERT_ID()"
    );
    db.close();
    return new File(res[0]);
  }

  async update(data: File, id: number): Promise<File> {
    const db = new Database();
    await db.executeQuery(`
        UPDATE files SET
            ORIGINAL_NAME = ${data.originalName},
            FILE_NAME = ${data.fileName},
            MIME_TYPE = ${data.mimeType},
            UPDATED_AT = NOW()
        WHERE FILE_ID = ${id}
    `);
    const res = await db.executeQuery(
      "SELECT * FROM files WHERE file_id = " + id
    );
    db.close();
    return new File(res[0]);
  }

  async delete(id: number): Promise<File> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM files WHERE file_id = " + id
    );
    await db.executeQuery("DELETE FROM files WHERE file_id = " + id);
    db.close();
    return res[0];
  }
}

export default FilesService;
