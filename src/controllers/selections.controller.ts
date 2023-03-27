import { CreateSelectionDto } from "@/dtos/selections.dto";
import { HttpException } from "@/exceptions/HttpException";
import { isEmpty } from "@/utils/util";
import { PrismaClient, Selection } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class SelectionsController {
  public seletions = new PrismaClient().selection;
  public users = new PrismaClient().user;

  public getSelections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllSelectionsData: Selection[] = await this.seletions.findMany();

      res.status(200).json({ data: findAllSelectionsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getSelectionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.id);
      if (isEmpty(selectionId)) throw new HttpException(400, "SelectionId is empty");

      const findSelectionData: Selection = await this.seletions.findUnique({
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

  public getCurrentUserSelections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 2;
      const findUser = await this.users.findUnique({
        where: { id: userId },
        include: {
          selections: true,
        },
      });

      if (!findUser) throw new HttpException(400, "User does not exist");

      res.status(201).json({
        data: findUser,
        message: "get current user's selections",
      });
    } catch (error) {
      next(error);
    }
  };

  public createSelection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionData: CreateSelectionDto = req.body;
      const createSelectionData = await this.seletions.create({
        data: {
          ...selectionData,
          selectedOptions: {
            createMany: {
              data: selectionData.selectedOptions.map(optionId => ({ optionId })),
            },
          },

          // CHANGE THIS
          userId: 2,
        },
      });

      if (!createSelectionData) throw new HttpException(400, "Cannot create selection");

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
      const findSelectionData = await this.seletions.findUnique({ where: { id: selectionId } });
      if (!findSelectionData) throw new HttpException(400, "Selection does not exist");

      const selectionData: Partial<CreateSelectionDto> = req.body;

      const updateSelectionData = await this.seletions.update({
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

      const findSelection = await this.seletions.findUnique({ where: { id: selectionId } });
      if (!findSelection) throw new HttpException(409, "Selection does not exist");

      const deleteQuestionData = await this.seletions.delete({ where: { id: selectionId } });

      res.status(200).json({ data: deleteQuestionData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default SelectionsController;
