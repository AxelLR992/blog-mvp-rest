import Database from "../../Database";
import AbstractService from "../../models/AbstractService";
import Post from "../../models/Post";
import mime from "mime-types";

class PostsService implements AbstractService<Post> {
  async get(): Promise<Post[]> {
    const db = new Database();
    const res = await db.executeQuery(`
      SELECT p.*, f.FILE_NAME, f.MIME_TYPE
      FROM posts p
      LEFT JOIN files f
        ON f.FILE_ID = p.HEADER_FILE_ID
    `);

    db.close();
    return res.map((post) => new Post(post));
  }

  async getById(id: number): Promise<Post> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM posts WHERE post_id = " + id
    );
    db.close();
    // Return undefined when a post wasn't found
    return res[0] ? new Post(res[0]) : res[0];
  }

  async getByPostTitle(title: string): Promise<Post[]> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM posts WHERE UPPER(title) LIKE '%" +
        title.toUpperCase() +
        "%'"
    );
    db.close();
    return res.map((post) => new Post(post));
  }

  async create(data: Post): Promise<Post> {
    const db = new Database();
    await db.executeQuery(`
        INSERT INTO posts (HEADER_FILE_ID, TITLE, CONTENT, CREATED_AT, UPDATED_AT)
        VALUES (${data.headerFileId || "NULL"}, ${data.title}, ${
      data.content
    }, NOW(), NOW())
    `);
    const res = await db.executeQuery(
      "SELECT * FROM posts WHERE post_id = LAST_INSERT_ID()"
    );
    db.close();
    return new Post(res[0]);
  }

  async update(data: Post, id: number): Promise<Post> {
    const db = new Database();
    await db.executeQuery(`
        UPDATE posts SET 
            HEADER_FILE_ID = ${data.headerFileId || "NULL"}, 
            TITLE = ${data.title}, 
            CONTENT = ${data.content}, 
            UPDATED_AT = NOW()
        WHERE POST_ID = ${id}
    `);
    const res = await db.executeQuery(
      "SELECT * FROM posts WHERE post_id = " + id
    );
    db.close();
    return res[0] ? new Post(res[0]) : res[0];
  }

  async delete(id: number): Promise<Post> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM posts WHERE post_id = " + id
    );
    await db.executeQuery("DELETE FROM posts WHERE post_id = " + id);
    db.close();
    return res[0] ? new Post(res[0]) : res[0];
  }
}

export default PostsService;
