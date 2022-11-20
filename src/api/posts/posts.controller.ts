import { Request, Response } from "express";
import AbstractController from "../../models/AbstractController";
import Post from "../../models/Post";
import PostsService from "./posts.service";
import mysql from "mysql";
import FilesService from "../files/files.service";
import File from "../../models/File";
import { validationResult } from "express-validator";

class PostController implements AbstractController<Post> {
  service = new PostsService();
  filesService = new FilesService();

  get = async (req: Request, res: Response) => {
    try {
      const posts = await this.service.get();
      const headerImages = await this.filesService.get();

      // Search for headerImages when it is defined
      const response = posts.map((post) => {
        // Not defined in post
        if (!post.headerFileId) return post;

        const header = headerImages.find(
          (file) => file.fileId === post.headerFileId
        );
        // Not found in database
        if (!header) return post;

        const url = req.protocol + "://" + req.get("host") + "/static/";
        // Found. Must be included in response.
        return {
          ...post,
          headerImageUrl: url + header.fileName,
          headerImageMimeType: header.mimeType,
        };
      });

      return res.json(response);
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
      const post = await this.service.getById(id);
      if (!post) return res.status(404).send("Requested ID not found");
      // Search for image header when it is defined
      if (post.headerFileId) {
        const header = await this.filesService.getById(post.headerFileId);
        // Not found in database
        if (!header) return res.json(post);

        const url = req.protocol + "://" + req.get("host") + "/static/";
        // Found. Must be included in response
        return res.json({
          ...post,
          headerImageUrl: url + header.fileName,
          headerImageMimeType: header.mimeType,
        });
      }
      // Header image not defined
      return res.json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };

  getByPostTitle = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const title = req.query.title as string;
      const result = await this.service.getByPostTitle(title);
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
      let file = new File();
      // Check that headerFile exists and it is a unique file (Not an array)
      if (
        req.files &&
        req.files.headerFile &&
        !Array.isArray(req.files.headerFile)
      ) {
        const headerFile = req.files.headerFile;
        // Create the file in database
        file = await this.filesService.create(headerFile);
      }

      // Create post
      const post = new Post();
      post.content = mysql.escape(req.body.content);
      post.title = mysql.escape(req.body.title);
      post.headerFileId = file?.fileId;
      const result = await this.service.create(post);
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
      const post = await this.service.getById(id);

      if (!post) return res.status(404).send("Requested ID not found");

      post.content = mysql.escape(req.body.content);
      post.title = mysql.escape(req.body.title);

      if (
        req.files &&
        req.files.headerFile &&
        !Array.isArray(req.files.headerFile)
      ) {
        const headerFile = req.files.headerFile;
        const file = await this.filesService.create(headerFile);
        post.headerFileId = file.fileId;
      }

      const result = await this.service.update(post, id);

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
      if (!result) return res.status(404).send("Requested ID not found");
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };
}

export default PostController;
