import Post from "../../models/Post";
import PostsService from "../posts/posts.service";
import dotenv from "dotenv";
import mysql from "mysql";
import PostComment from "../../models/Comment";
import cleanDatabase from "../../utils/cleanDatabase";
import CommentsService from "./comments.service";

describe("Comments service", () => {
  let post: Post, post2: Post;
  let comment: PostComment, comment2: PostComment;
  const service = new CommentsService();

  beforeAll(async () => {
    // Setup dotenv
    dotenv.config({ path: "./.env.test" });

    // Create some post to relate comments
    const postService = new PostsService();
    const p = new Post();
    p.content = mysql.escape("<h1>Test post</h1>");
    p.title = mysql.escape("Test post");
    const p2 = new Post();
    p2.content = mysql.escape("<h1>Test post 2</h1>");
    p2.title = mysql.escape("Test post 2");
    post = await postService.create(p2);
    post2 = await postService.create(p2);
  });

  describe("Creation", () => {
    it("Returns fully created comment object after creation", async () => {
      const c1 = new PostComment();
      c1.author = mysql.escape("John Doe");
      c1.content = mysql.escape("This is a comment from John Doe");
      c1.postId = post.postId;
      comment = await service.create(c1);

      const c2 = new PostComment();
      c2.author = mysql.escape("John Doe 2");
      c2.content = mysql.escape("This is another comment from John Doe");
      c2.postId = post2.postId;
      comment2 = await service.create(c2);

      expect(typeof comment.commentId).toBe("number");
      expect(typeof comment2.commentId).toBe("number");
    });
  });

  describe("Query", () => {
    it("Returns all the created comments", async () => {
      const comments = await service.get();
      expect(comments.length).toBe(2);
    });

    it("Filter comments by post ID", async () => {
      const comments = await service.get({ postId: post.postId });
      expect(comments.length).toBe(1);
    });

    it("Returns a comment instance when querying by ID", async () => {
      const c = await service.getById(comment.commentId);
      expect(c).toBeInstanceOf(PostComment);
    });

    it("Returns undefined when querying non-existent ID", async () => {
      const nonExistentId = getNonExistentId(comment, comment2);

      const c = await service.getById(nonExistentId);
      expect(c).toBe(undefined);
    });
  });

  describe("Update", () => {
    it("Updates comment", async () => {
      comment.author = mysql.escape("Jane Doe");
      comment.content = mysql.escape("Updated comment");
      comment.postId = post2.postId;
      const dateBefore = comment.updatedAt;

      const updated = await service.update(comment, comment.commentId);
      expect(updated.author).toBe("Jane Doe");
      expect(updated.content).toBe("Updated comment");
      expect(updated.postId).toBe(post2.postId);
      expect(updated.updatedAt).not.toBe(dateBefore);
    });

    it("Returns undefined if element doesn't exist", async () => {
      const nonExistentId = getNonExistentId(comment, comment2);

      const updated = await service.update(comment, nonExistentId);
      expect(updated).toBe(undefined);
    });
  });

  describe("Removal", () => {
    it("Removes specified comment and returns removed element", async () => {
      const removed = await service.delete(comment2.commentId);
      expect(removed).toBeInstanceOf(PostComment);
    });

    it("Returns undefined if element doesn't exist", async () => {
      const nonExistentId = getNonExistentId(comment, comment2);

      const removed = await service.delete(nonExistentId);
      expect(removed).toBe(undefined);
    });
  });

  afterAll(async () => {
    await cleanDatabase();
  });
});

const getNonExistentId = (comment: PostComment, comment2: PostComment) => {
  // Random number between 0 and 100
  let nonExistentId = Math.random() * 101;
  // Check that the ID doesn't exists
  while (
    nonExistentId === comment.commentId ||
    nonExistentId === comment2.commentId
  ) {
    nonExistentId = Math.random() * 101;
  }

  return nonExistentId;
};
