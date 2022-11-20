import { body, param } from "express-validator";
import PostsService from "../posts/posts.service";

export const validateAuthor = body("author")
  .notEmpty()
  .withMessage("Field is required")
  .isLength({ max: 50 })
  .withMessage("Must have a maximum length of 50");

export const validateCommentContent = body("content")
  .notEmpty()
  .withMessage("Field is required")
  .isLength({ max: 500 })
  .withMessage("Must have a maximum length of 500");

export const validatePostId = body("postId")
  .notEmpty()
  .withMessage("Field is required")
  .isInt()
  .withMessage("Field must be integer")
  .custom(async (value, { req }) => {
    // Validate that post exists
    const service = new PostsService();

    const postId = Number(req.body.postId);
    const post = await service.getById(postId);
    if (!post) return Promise.reject();
    return Promise.resolve();
  })
  .withMessage("Specified post doesn't exist");

export const validateId = param("id").isInt();
