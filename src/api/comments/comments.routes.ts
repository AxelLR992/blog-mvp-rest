import { Router } from "express";
import CommentsController from "./comments.controller";
import {
  validateAuthor,
  validateCommentContent,
  validateId,
  validatePostId,
} from "./comments.validations";

const controller = new CommentsController();
const router = Router();

router.get("/", controller.get);
router.get("/:id", validateId, controller.getById);
router.post(
  "/",
  validateAuthor,
  validateCommentContent,
  validatePostId,
  controller.post
);
router.put(
  "/:id",
  validateId,
  validateAuthor,
  validateCommentContent,
  controller.put
);
router.delete("/:id", validateId, controller.delete);

export default router;
