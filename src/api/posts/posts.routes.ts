import { Router } from "express";
import PostsController from "./posts.controller";
import {
  validateContent,
  validateHeaderFile,
  validateId,
  validateTitle,
  validateTitleSearch,
} from "./posts.validations";

const controller = new PostsController();
const router = Router();

router.get("/", controller.get);
router.get("/by-title", validateTitleSearch, controller.getByPostTitle);
router.get("/:id", validateId, controller.getById);
router.post(
  "/",
  validateTitle,
  validateContent,
  validateHeaderFile,
  controller.post
);
router.put(
  "/:id",
  validateId,
  validateTitle,
  validateContent,
  validateHeaderFile,
  controller.put
);
router.delete("/:id", validateId, controller.delete);

export default router;
