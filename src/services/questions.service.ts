import { HttpException } from "@/exceptions/HttpException";
import { PrismaClient } from "@prisma/client";

class QuestionsService {
  public questions = new PrismaClient().question;

  public getQuestionByAppId = async (appId: number): Promise<any> => {
    const findQuestionsOfAppData: any = await this.questions.findMany({
      where: {
        appId,
      },
      include: {
        options: true,
      },
    });
    if (!findQuestionsOfAppData) throw new HttpException(400, "AppId does not exist");

    return findQuestionsOfAppData;
  };
}

export default QuestionsService;
