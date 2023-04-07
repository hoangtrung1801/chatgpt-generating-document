import { HttpException } from "@/exceptions/HttpException";
import EpicsService from "@/services/epics.service";
import UserStoryService from "@/services/user-stories.service";
import { isEmpty } from "@/utils/util";
import { NextFunction, Request, Response } from "express";

class EpicsController {
  public epicsService = new EpicsService();
  public userStoryService = new UserStoryService();

  public getAllEpics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllEpicsData = await this.epicsService.getAllEpics();

      res.status(200).json({ data: findAllEpicsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getEpicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const epicId = Number(req.params.id);
      if (isEmpty(epicId)) throw new HttpException(400, "EpicId is empty");

      const findEpicData = await this.epicsService.getEpicById(epicId);
      res.status(200).json({ data: findEpicData, message: "find epic by id" });
    } catch (error) {
      next(error);
    }
  };

  public getUserStoriesInEpic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const epicId = Number(req.params.id);
      if (isEmpty(epicId)) throw new HttpException(400, "EpicId is empty");

      const findUserStoriesInEpicData = await this.userStoryService.getUserStoriesInEpic(epicId);
      res.status(200).json({ data: findUserStoriesInEpicData, message: "find user stories in epic" });
    } catch (error) {
      next(error);
    }
  };

  public createEpic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createEpicData = await this.epicsService.createEpic(req.body);

      res.status(201).json({ data: createEpicData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateEpic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const epicId = Number(req.params.id);
      if (isEmpty(epicId)) throw new HttpException(400, "EpicId is empty");

      const updateEpicData = await this.epicsService.updateEpic(epicId, req.body);

      res.status(200).json({ data: updateEpicData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };
}

export default EpicsController;
