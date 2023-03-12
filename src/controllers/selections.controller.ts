import { CreateSelectionDto } from "@/dtos/selections.dto";
import { HttpException } from "@/exceptions/HttpException";
import { isEmpty } from "@/utils/util";
import { PrismaClient, Selection } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class SelectionsController {
  public seletions = new PrismaClient().selection;

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

  public createSelection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // const userData: CreateUserDto = req.body;
      // const createUserData: User = await this.categoriesService.createUser(userData);

      // res.status(201).json({ data: createQuestionData, message: "created" });

      // const questionData: CreateQuestionDto = req.body;
      // const optionsData = questionData.options;

      // const createQuestionData: Question = await this.questions.create({
      //   data: {
      //     name: questionData.name,
      //     description: questionData.description,
      //     questionGPT: questionData.questionGPT,
      //     categoryId: questionData.categoryId,
      //     options: {
      //       createMany: {
      //         data: optionsData,
      //       },
      //     },
      //   },
      //   include: {
      //     options: true,
      //   },
      // });

      const selectionData: CreateSelectionDto = req.body;
      console.log(selectionData);
      const createSelectionData = await this.seletions.create({
        data: {
          selectedOptions: {
            createMany: {
              data: selectionData.selectedOptions.map(optionId => ({ optionId })),
            },
          },
          categoryId: selectionData.categoryId
        },
      });

      res.status(201).json({
        data: createSelectionData,
        message: "created",
      });
    } catch (error) {
      next(error);
    }
  };

  //   public updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const questionId = Number(req.params.id);
  //       const questionData: Partial<Question> = req.body;
  //       // const updateUserData: Question = await this.categoriesService.updateUser(categoryId, categoryData);
  //       const updateQuestionData: Question = await this.questions.update({
  //         where: {
  //           id: questionId,
  //         },
  //         data: questionData,
  //       });

  //       res.status(200).json({ data: updateQuestionData, message: "updated" });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  //   public deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const questionId = Number(req.params.id);

  //       const findQuestion = await this.questions.findUnique({ where: { id: questionId } });
  //       if (!findQuestion) throw new HttpException(409, "Question does not exist");

  //       const deleteQuestionData: Question = await this.questions.delete({ where: { id: questionId } });

  //       res.status(200).json({ data: deleteQuestionData, message: "deleted" });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
}

export default SelectionsController;
