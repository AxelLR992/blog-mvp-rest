import { Request, Response } from "express";
import AbstractController from "../../models/AbstractController";
import PostComment from "../../models/Comment";
import CommentsService from "./comments.service";
import mysql from "mysql";
import { validationResult } from "express-validator";

class CommentsController implements AbstractController<PostComment> {
  service = new CommentsService();

  get = async (req: Request, res: Response) => {
    try {
      const result = await this.service.get({
        postId: Number(req.query.postId) || undefined,
      });
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };

  getById = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const id = Number(req.params.id);
      const result = await this.service.getById(id);
      if (!result) return res.status(404).send("Requested ID not found");
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };

  post = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const comment = new PostComment();
      comment.author = mysql.escape(req.body.author);
      comment.content = mysql.escape(req.body.content);
      comment.postId = Number(req.body.postId);
      const result = await this.service.create(comment);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };

  put = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const id = Number(req.params.id);
      const comment = await this.service.getById(id);

      if (!comment) return res.status(404).send("Requested ID not found");

      comment.author = mysql.escape(req.body.author);
      comment.content = mysql.escape(req.body.content);

      const result = await this.service.update(comment, id);

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };

  delete = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const id = Number(req.params.id);
      const result = await this.service.delete(id);
      if (!result) res.status(404).send("Requested ID not found");
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };
}

export default CommentsController;
