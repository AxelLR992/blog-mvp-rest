import Database from "../../Database";
import AbstractService from "../../models/AbstractService";
import PostComment from "../../models/Comment";

class CommentsService implements AbstractService<PostComment> {
  async get(params?: IGetParams): Promise<PostComment[]> {
    const db = new Database();
    // 1=1 is a little trick to ignore the condition if parameter was not provided
    const res = await db.executeQuery(`
        SELECT * FROM comments
        WHERE
            ${params?.postId ? "post_id = " + params.postId : "1=1"}
    `);
    db.close();
    return res.map((comment) => new PostComment(comment));
  }

  async getById(id: number): Promise<PostComment> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM comments WHERE comment_id = " + id
    );
    db.close();
    // Return undefined when a post wasn't found
    return res[0] ? new PostComment(res[0]) : res[0];
  }

  async create(data: PostComment): Promise<PostComment> {
    const db = new Database();
    await db.executeQuery(`
        INSERT INTO comments (POST_ID, AUTHOR, CONTENT, CREATED_AT, UPDATED_AT)
        VALUES (${data.postId}, ${data.author}, ${data.content}, NOW(), NOW())
    `);
    const res = await db.executeQuery(
      "SELECT * FROM comments WHERE comment_id = LAST_INSERT_ID()"
    );
    db.close();
    return new PostComment(res[0]);
  }

  async update(data: PostComment, id: number): Promise<PostComment> {
    const db = new Database();
    await db.executeQuery(`
        UPDATE comments SET
            POST_ID = ${data.postId},
            AUTHOR = ${data.author},
            CONTENT = ${data.content},
            UPDATED_AT = NOW()
        WHERE COMMENT_ID = ${id}
    `);
    const res = await db.executeQuery(
      "SELECT * FROM comments WHERE comment_id = " + id
    );
    db.close();
    return res[0] ? new PostComment(res[0]) : res[0];
  }

  async delete(id: number): Promise<PostComment> {
    const db = new Database();
    const res = await db.executeQuery(
      "SELECT * FROM comments WHERE comment_id = " + id
    );
    await db.executeQuery("DELETE FROM comments WHERE comment_id = " + id);
    db.close();
    return res[0] ? new PostComment(res[0]) : res[0];
  }
}

export default CommentsService;

interface IGetParams {
  postId?: number;
}
