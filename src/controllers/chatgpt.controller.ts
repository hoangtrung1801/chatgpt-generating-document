import { GenerateBriefAnswerDto } from "@/dtos/chatgpt.dto";
import { HttpException } from "@/exceptions/HttpException";
import { chatGPTRequestBriefPrompt } from "@/utils/chatgpt-request";
import { generateBriefPrompt } from "@/utils/generate-chatgpt-prompt";
import { ChatGPTBriefAnswer, ChatGPTQuestionAnswer, PrismaClient, Selection } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class ChatGPTController {
  public chatgptBrief = new PrismaClient().chatGPTBriefAnswer;
  public chatgptQuestion = new PrismaClient().chatGPTQuestionAnswer;
  public selections = new PrismaClient().selection;

  public getBriefAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllBriefAnswers: ChatGPTBriefAnswer[] = await this.chatgptBrief.findMany();

      res.status(200).json({
        data: findAllBriefAnswers,
        message: "found all",
      });
    } catch (error) {
      next(error);
    }
  };

  public getBriefAnswerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const briefId = Number(req.params.id);
      const findBriefAnswer = await this.chatgptBrief.findUnique({
        where: {
          id: briefId,
        },
      });

      res.status(200).json({
        data: findBriefAnswer,
        message: "found brief answer",
      });
    } catch (error) {
      next(error);
    }
  };

  public getQuestionAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllQuestionAnswers: ChatGPTQuestionAnswer[] = await this.chatgptQuestion.findMany();
      res.status(200).json({
        data: findAllQuestionAnswers,
        message: "findAll",
      });
    } catch (error) {
      next(error);
    }
  };

  public generateBriefAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const generateBriefData: GenerateBriefAnswerDto = req.body;

      const selectionId = generateBriefData.selectionId;
      const findSelectionData = await this.selections.findUnique({
        where: { id: selectionId },
        include: {
          selectedOptions: {
            include: {
              option: {
                include: {
                  question: true,
                },
              },
            },
          },
          category: true,
        },
      });
      if (!findSelectionData) throw new HttpException(400, "SelectionId does not exist");

      // get questions
      const selectedQuestions = {};

      const selectedOptionsData = findSelectionData.selectedOptions;
      const optionsData = selectedOptionsData.map(obj => obj.option);

      optionsData.forEach(option => {
        if (!selectedQuestions[option.question.name]) {
          selectedQuestions[option.question.name] = [option.name];
        } else {
          selectedQuestions[option.question.name] = [...selectedQuestions[option.question.name], option.name];
        }
      });

      // get category name
      const categoryData = findSelectionData.category;
      const categoryName = categoryData.name;

      const briefPrompt = generateBriefPrompt(categoryName, selectedQuestions);

      const chatGPTResponse = await chatGPTRequestBriefPrompt(briefPrompt);
      console.log("chatGPTResponse", chatGPTResponse);
      const answer = chatGPTResponse.choices[0].message.content;

      const chatgptAnswer = await this.chatgptBrief.create({
        data: {
          answer,
          selectionId,
        },
      });

      // const chatgptAnswer = {};

      res.status(200).json({
        data: chatgptAnswer,
        message: "generate brief",
      });
    } catch (error) {
      next(error);
    }
  };

  // public generateQuestionAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const briefPrompt = generateBriefPrompt("uber", ["payment", "shipping"]);

  //     const chatGPTResponse = await chatGPTRequestBriefPrompt(briefPrompt);

  //     const answer = chatGPTResponse.choices[0].message.content;

  //     res.status(200).json({
  //       data: answer,
  //       message: "generate brief",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  //   public questions = new PrismaClient().question;
  //   public options = new PrismaClient().option;
  //   public getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const findAllQuestionsData: Question[] = await this.questions.findMany();
  //       res.status(200).json({ data: findAllQuestionsData, message: "findAll" });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
  //   public getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const questionId = Number(req.params.id);
  //       if (isEmpty(questionId)) throw new HttpException(400, "QuestionId is empty");
  //       const findQuestionData: Question = await this.questions.findUnique({
  //         where: { id: questionId },
  //         include: {
  //           options: true,
  //         },
  //       });
  //       if (!findQuestionData) throw new HttpException(400, "QuestionId does not exist");
  //       res.status(200).json({ data: findQuestionData, message: "findOne" });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
  //   public createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       // const userData: CreateUserDto = req.body;
  //       // const createUserData: User = await this.categoriesService.createUser(userData);
  //       // res.status(201).json({ data: createQuestionData, message: "created" });
  //       const questionData: CreateQuestionDto = req.body;
  //       const optionsData = questionData.options;
  //       const createQuestionData: Question = await this.questions.create({
  //         data: {
  //           name: questionData.name,
  //           description: questionData.description,
  //           questionGPT: questionData.questionGPT,
  //           categoryId: questionData.categoryId,
  //           options: {
  //             createMany: {
  //               data: optionsData,
  //             },
  //           },
  //         },
  //         include: {
  //           options: true,
  //         },
  //       });
  //       res.status(201).json({
  //         data: createQuestionData,
  //         message: "created",
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
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

export default ChatGPTController;