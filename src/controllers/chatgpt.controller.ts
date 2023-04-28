import { GenerateBriefAnswerDto } from "@/dtos/chatgpt.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import ChatGPTService from "@/services/chatgpt.service";
import UserStoryService from "@/services/user-stories.service";
import { chatGPTRequestBriefPrompt } from "@/utils/chatgpt-request";
import { generateBriefPrompt } from "@/utils/generate-chatgpt-prompt";
import { jiraPushUserStory } from "@/utils/jira-reqests";
import { ChatGPTBriefAnswer, ChatGPTQuestionAnswer, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class ChatGPTController {
  public chatgptBrief = new PrismaClient().chatGPTBriefAnswer;
  public chatgptQuestion = new PrismaClient().chatGPTQuestionAnswer;
  public selections = new PrismaClient().selection;

  public chatgptService = new ChatGPTService();
  public userStoryService = new UserStoryService();

  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.chatgptService.test();

      res.status(200).json({
        data: {},
        message: "found all",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public getBriefAnswers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      const findAllBriefAnswers: ChatGPTBriefAnswer[] = await this.chatgptService.getBriefsOfUser(user.id);

      res.status(200).json({
        data: findAllBriefAnswers,
        count: await this.chatgptBrief.count(),
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
      const selectionId = Number(req.params.selectionId);
      if (!selectionId) throw new HttpException(400, "SelectionId does not exist");

      const chatgptBrief = await this.chatgptService.generateBrief(selectionId);

      res.status(200).json({
        data: chatgptBrief,
        // data: {},
        message: "generate brief",
      });
    } catch (error) {
      next(error);
    }
  };

  public generateUserStoryList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const briefId = Number(req.params.id);
      const brief = await this.chatgptService.getBriefById(briefId);

      if (!brief) throw new HttpException(400, "Brief does not exist");

      const userStories = await this.chatgptService.generateUserStoryList(briefId);

      // UPDATE
      const responses = await Promise.all([
        // ...userStories.map(todo => this.userStoryService.addUserStory(todo, brief.selectionId)),
        // ...userStories.map(todo => jiraPushUserStory(todo)),
      ]);

      const userStoriesData = responses.slice(0, responses.length / 2);

      res.status(200).json({
        data: userStoriesData,
        message: "generated user story list",
      });
    } catch (error) {
      next(error);
    }
  };

  public generateUserFlow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.selectionId);
      if (!selectionId) throw new HttpException(400, "SelectionId does not exist");

      const userFlow = await this.chatgptService.generateUserFlow(selectionId);

      res.status(200).json({
        data: userFlow,
        message: "generated user flow",
      });
    } catch (error) {
      next(error);
    }
  };

  public generateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.selectionId);
      console.log({ selectionId });
      if (!selectionId) throw new HttpException(400, "SelectionId does not exist");

      const document = await this.chatgptService.generateDocument(selectionId);

      res.status(200).json({
        data: document,
        message: "generated document",
      });
    } catch (error) {
      next(error);
    }
  };

  public generatePartOfDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.selectionId);
      if (!selectionId) throw new HttpException(400, "SelectionId does not exist");

      const partId = req.params.partId;
      if (!partId) throw new HttpException(400, "PartId does not exist");

      // const data = await this.chatgptService.generatePartOfDocument(selectionId, partId);

      res.status(200).json({
        // data,
        message: "generated part of document",
      });
    } catch (error) {
      next(error);
    }
  };

  public getDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectionId = Number(req.params.selectionId);
      if (!selectionId) throw new HttpException(400, "SelectionId does not exist");

      const document = await this.chatgptService.getDocument(selectionId);

      res.status(200).json({
        data: document,
        message: "get document",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatGPTController;
