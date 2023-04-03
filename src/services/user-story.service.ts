import { UpdateStoryDto } from "@/dtos/user-story.dto";
import { HttpException } from "@/exceptions/HttpException";
import { PrismaClient, UserStory } from "@prisma/client";

class UserStoryService {
  public userStories = new PrismaClient().userStory;

  public async getUserStoryById(id: number) {
    const findUserStory = await this.userStories.findUnique({
      where: {
        id,
      },
    });

    if (!findUserStory) throw new HttpException(400, "User story does not exist");
    return findUserStory;
  }

  public async addUserStory(title: string, selectionId: number) {
    const createUserStory = await this.userStories.create({
      data: {
        title,
        selection: {
          connect: {
            id: selectionId,
          },
        },
      },
    });
    return createUserStory;
  }

  public async updateUserStory(id: number, userStory: UpdateStoryDto) {
    const findUserStory = await this.userStories.findUnique({
      where: {
        id,
      },
    });
    if (!findUserStory) throw new HttpException(400, "User story does not exist");

    const updateUserStory = await this.userStories.update({
      where: {
        id,
      },
      data: userStory as UserStory,
    });
    return updateUserStory;
  }
}

export default UserStoryService;
