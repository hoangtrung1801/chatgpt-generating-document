import { CreateUserStoryDto } from "@/dtos/user-story.dto";
import UserStoryService from "@/services/user-stories.service";
import { NextFunction, Request, Response } from "express";

class UserStoriesController {
  public userStoriesService = new UserStoryService();

  public getAllUserStories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const allUserStories = await this.userStoriesService.getAllUserStories();

      res.status(200).json({ data: allUserStories, message: "All user stories" });
    } catch (error) {
      next(error);
    }
  };

  public getUserStoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userStoryId = Number(req.params.id);
      const findUserStory = await this.userStoriesService.getUserStoryById(userStoryId);

      res.status(200).json({ data: findUserStory, message: "User story found" });
    } catch (error) {
      next(error);
    }
  };

  public createUserStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userStoryData: CreateUserStoryDto = req.body;
      const createUserData = await this.userStoriesService.addUserStory(userStoryData);

      res.status(201).json({ data: createUserData, message: "User story created" });
    } catch (error) {
      next(error);
    }
  };

  public updateUserStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userStoryId = Number(req.params.id);

      const userStoryData: CreateUserStoryDto = req.body;
      const updateUserData = await this.userStoriesService.updateUserStory(userStoryId, userStoryData);

      res.status(200).json({ data: updateUserData, message: "User story updated" });
    } catch (error) {
      next(error);
    }
  };
}

export default UserStoriesController;
