import { HttpException } from "@/exceptions/HttpException";
import SprintsService from "@/services/sprints.service";
import UserStoryService from "@/services/user-stories.service";
import { isEmpty } from "class-validator";
import { NextFunction, Request, Response } from "express";

class SprintsController {
  public sprintsService = new SprintsService();
  public userStoriesService = new UserStoryService();

  public getAllSprints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSprintsData = await this.sprintsService.getAllSprints();

      res.status(200).json({ data: findAllSprintsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getSprintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprintId = Number(req.params.id);
      if (isEmpty(sprintId)) throw new HttpException(400, "SprintId is empty");

      const findSprintData = await this.sprintsService.getSprintById(sprintId);
      res.status(200).json({ data: findSprintData, message: "find sprint by id" });
    } catch (error) {
      next(error);
    }
  };

  public getSprintsInSelection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const selectionId = Number(req.params.id);
      if (isEmpty(selectionId)) throw new HttpException(400, "SelectionId is empty");

      const findSprintsInSelectionData = await this.sprintsService.getSprintsInSelection(selectionId);

      res.status(200).json({ data: findSprintsInSelectionData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getUserStoriesInSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprintId = Number(req.params.id);
      if (isEmpty(sprintId)) throw new HttpException(400, "SprintId is empty");

      const findUserStoriesInSprintData = await this.userStoriesService.getUserStoriesInSprint(sprintId);
      res.status(200).json({ data: findUserStoriesInSprintData, message: "find user stories in sprint" });
    } catch (error) {
      next(error);
    }
  };

  public createSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createSprintData = await this.sprintsService.createSprint(req.body);

      res.status(201).json({ data: createSprintData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprintId = Number(req.params.id);
      if (isEmpty(sprintId)) throw new HttpException(400, "SprintId is empty");

      const updateSprintData = await this.sprintsService.updateSprint(sprintId, req.body);

      res.status(200).json({ data: updateSprintData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };
}

export default SprintsController;
