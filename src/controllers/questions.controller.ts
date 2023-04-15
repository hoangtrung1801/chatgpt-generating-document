import { CreateQuestionDto } from "@/dtos/questions.dto";
import { HttpException } from "@/exceptions/HttpException";
import QuestionsService from "@/services/questions.service";
import { isEmpty } from "@/utils/util";
import { PrismaClient, Question } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class QuestionsController {
  public questions = new PrismaClient().question;
  public options = new PrismaClient().option;

  public questionsService = new QuestionsService();

  public getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllQuestionsData: Question[] = await this.questions.findMany();

      res.status(200).json({ data: findAllQuestionsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const questionId = Number(req.params.id);
      if (isEmpty(questionId)) throw new HttpException(400, "QuestionId is empty");

      const findQuestionData: Question = await this.questions.findUnique({
        where: { id: questionId },
        include: {
          options: true,
        },
      });
      if (!findQuestionData) throw new HttpException(400, "QuestionId does not exist");

      res.status(200).json({ data: findQuestionData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public getQuestionsByAppId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appId = Number(req.params.appId);
      if (isEmpty(appId)) throw new HttpException(400, "AppId is empty");

      const findQuestionsOfAppData: any = await this.questionsService.getQuestionByAppId(appId);

      res.status(200).json({ data: findQuestionsOfAppData, message: "found questions of app" });
    } catch (error) {
      next(error);
    }
  };

  public createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // const userData: CreateUserDto = req.body;
      // const createUserData: User = await this.categoriesService.createUser(userData);

      // res.status(201).json({ data: createQuestionData, message: "created" });

      const questionData: CreateQuestionDto = req.body;
      const optionsData = questionData.options;

      const createQuestionData: Question = await this.questions.create({
        data: {
          name: questionData.name,
          description: questionData?.description,
          questionGPT: questionData?.questionGPT,
          keyword: questionData?.keyword || "",
          status: questionData?.status,
          appId: questionData.appId,
          type: questionData.type,
          options: {
            createMany: {
              data: optionsData,
            },
          },
        },
        include: {
          options: true,
        },
      });

      res.status(201).json({
        data: createQuestionData,
        message: "created",
      });
    } catch (error) {
      next(error);
    }
  };

  public updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const questionId = Number(req.params.id);
      const questionData: Partial<Question> = req.body;
      // const updateUserData: Question = await this.categoriesService.updateUser(categoryId, categoryData);
      const updateQuestionData: Question = await this.questions.update({
        where: {
          id: questionId,
        },
        data: questionData,
      });

      res.status(200).json({ data: updateQuestionData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const questionId = Number(req.params.id);

      const findQuestion = await this.questions.findUnique({ where: { id: questionId } });
      if (!findQuestion) throw new HttpException(409, "Question does not exist");

      const deleteQuestionData: Question = await this.questions.delete({ where: { id: questionId } });

      res.status(200).json({ data: deleteQuestionData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default QuestionsController;
