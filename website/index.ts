import express, { Request, Response, NextFunction } from "express";
import path from "path";
import serverless from "serverless-http";

const app = express();

/**
 * This middleware disables caching for all routes. This is generally not
 * recommended for production, but is useful for development.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(express.static(path.join(__dirname, "app", "build")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "app", "build", "index.html"));
});

export const handler = serverless(app);
