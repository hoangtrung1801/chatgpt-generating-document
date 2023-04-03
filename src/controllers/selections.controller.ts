import { CreateSelectionDto } from "@/dtos/selections.dto";
import { UpdateStoryDto } from "@/dtos/user-story.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import SelectionService from "@/services/selections.service";
import UserStoryService from "@/services/user-story.service";
import { isEmpty } from "@/utils/util";
import { PrismaClient, Selection } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class SelectionsController {
  public selections = new PrismaClient().selection;
  public users = new PrismaClient().user;

  public selectionService = new SelectionService();
  public userStoryService = new UserStoryService();

  public getSelections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllSelectionsData: Selection[] = await this.selections.findMany();

      res.status(200).json({ data: findAllSelectionsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getSelectionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.id);
      if (isEmpty(selectionId)) throw new HttpException(400, "SelectionId is empty");

      const findSelectionData: Selection = await this.selections.findUnique({
        where: { id: selectionId },
        include: {
          selectedOptions: {
            include: {
              option: true,
            },
          },
        },
      });
      if (!findSelectionData) throw new HttpException(400, "SelectionId does not exist");

      res.status(200).json({ data: findSelectionData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUserSelections = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const findCurrentUserSelections = await this.selectionService.findCurrentUserSelections(user.id);

      res.status(201).json({
        data: findCurrentUserSelections,
        message: "get current user's selections",
      });
    } catch (error) {
      next(error);
    }
  };

  public createSelection = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      const createSelectionData = await this.selectionService.createSelection(req.body, user.id);

      res.status(201).json({
        data: createSelectionData,
        message: "created",
      });
    } catch (error) {
      next(error);
    }
  };

  public updateSelection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.id);
      const findSelectionData = await this.selections.findUnique({ where: { id: selectionId } });
      if (!findSelectionData) throw new HttpException(400, "Selection does not exist");

      const selectionData: Partial<CreateSelectionDto> = req.body;

      const updateSelectionData = await this.selections.update({
        where: {
          id: selectionId,
        },
        data: {
          ...(selectionData as Selection),
        },
      });

      res.status(200).json({ data: updateSelectionData, message: "updated selection" });
    } catch (error) {
      next(error);
    }
  };

  public deleteSelection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.id);

      const findSelection = await this.selections.findUnique({ where: { id: selectionId } });
      if (!findSelection) throw new HttpException(409, "Selection does not exist");

      const deleteQuestionData = await this.selections.delete({ where: { id: selectionId } });

      res.status(200).json({ data: deleteQuestionData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };

  public getUserStoriesInSelection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.id);

      const findSelection = await this.selections.findUnique({
        where: { id: selectionId },
        include: {
          userStories: true,
        },
      });

      if (!findSelection) throw new HttpException(400, "Selection does not exist");

      const findUserStories = findSelection.userStories;

      res.status(200).json({ data: findUserStories, message: "get user stories in selection" });
    } catch (error) {
      next(error);
    }
  };

  public updateUserStoriesInSelection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.id);
      const findSelection = await this.selectionService.getSelectionById(selectionId);

      const userStory = req.body as UpdateStoryDto;
      if (isEmpty(userStory)) throw new HttpException(400, "User story body is empty");

      const userStoryId = Number(req.params.userStoryId);
      const updateUserStory = await this.userStoryService.updateUserStory(userStoryId, req.body);

      res.status(200).json({ data: updateUserStory, message: "update user stories in selection" });
    } catch (error) {
      next(error);
    }
  };
}

export default SelectionsController;
