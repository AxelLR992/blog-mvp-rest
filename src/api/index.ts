import { Express, Request, Response } from "express";

import postsRoutes from "./posts/posts.routes";
import commentsRoutes from "./comments/comments.routes";

export default function (server: Express) {
  server.use("/posts", postsRoutes);  
  server.use("/comments", commentsRoutes);

  // Fallback route
  server.use("/", (req: Request, res: Response) => {
    res.send(
      "Simple blog MVP REST APIs"
    );
  });
}