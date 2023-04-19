import { generateBriefPrompt } from "@/utils/generate-chatgpt-prompt";
import { NextFunction, Request, Response } from "express";

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const version = "v0.0.1";
      res.send({
        version,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
