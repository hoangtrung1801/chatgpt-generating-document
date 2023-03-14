import { generateBriefPrompt } from "@/utils/generate-chatgpt-prompt";
import { NextFunction, Request, Response } from "express";

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const prompt = generateBriefPrompt("uber", {
        chat: ["via Twitter, via Google"],
      });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
