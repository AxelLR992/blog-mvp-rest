import Post from "../../models/Post";
import PostsService from "../posts/posts.service";
import dotenv from "dotenv";
import mysql from "mysql";
import cleanDatabase from "../../utils/cleanDatabase";

describe("Posts service", () => {
  let post: Post, post2: Post;
  const service = new PostsService();

  beforeAll(async () => {
    // Setup dotenv
    dotenv.config({ path: "./.env.test" });
  });

  describe("Creation", () => {
    it("Returns fully created post object after creation", async () => {
      const p1 = new Post();
      p1.content = mysql.escape("<h1>This is a post test</h1>");
      p1.title = mysql.escape("Test");
      post = await service.create(p1);

      const p2 = new Post();
      p2.content = mysql.escape("<p>The latest news of the season</p>");
      p2.title = mysql.escape("Latest news");
      post2 = await service.create(p2);

      expect(typeof post.postId).toBe("number");
      expect(typeof post2.postId).toBe("number");
    });
  });

  describe("Query", () => {
    it("Returns all the created posts", async () => {
      const posts = await service.get();
      expect(posts.length).toBe(2);
    });

    it("Search posts by title using natural language", async () => {
      const posts = await service.getByPostTitle("NeWs");
      expect(posts.length).toBe(1);
    });

    it("Returns a post instance when querying by ID", async () => {
      const p = await service.getById(post.postId);
      expect(p).toBeInstanceOf(Post);
    });

    it("Returns undefined when querying non-existent ID", async () => {
      const nonExistentId = getNonExistentId(post, post2);

      const p = await service.getById(nonExistentId);
      expect(p).toBe(undefined);
    });
  });

  describe("Update", () => {
    it("Updates post", async () => {
      post.content = mysql.escape("<h2>Updated post content</h2>");
      post.title = mysql.escape("Updated post");
      const dateBefore = post.updatedAt;

      const updated = await service.update(post, post.postId);
      expect(updated.title).toBe("Updated post");
      expect(updated.content).toBe("<h2>Updated post content</h2>");
      expect(updated.updatedAt).not.toBe(dateBefore);
    });

    it("Returns undefined if element doesn't exist", async () => {
      const nonExistentId = getNonExistentId(post, post2);

      const updated = await service.update(post, nonExistentId);
      expect(updated).toBe(undefined);
    });
  });

  describe("Removal", () => {
    it("Removes specified post and returns removed element", async () => {
      const removed = await service.delete(post2.postId);
      expect(removed).toBeInstanceOf(Post);
    });

    it("Returns undefined if element doesn't exist", async () => {
      const nonExistentId = getNonExistentId(post, post2);

      const removed = await service.delete(nonExistentId);
      expect(removed).toBe(undefined);
    });
  });

  afterAll(async () => {
    await cleanDatabase();
  });
});

const getNonExistentId = (post: Post, post2: Post) => {
  // Random number between 0 and 100
  let nonExistentId = Math.random() * 101;
  // Check that the ID doesn't exists
  while (nonExistentId === post.postId || nonExistentId === post2.postId) {
    nonExistentId = Math.random() * 101;
  }

  return nonExistentId;
};
