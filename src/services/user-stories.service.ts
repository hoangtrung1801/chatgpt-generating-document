import { CreateUserStoryDto } from "@/dtos/user-story.dto";
import { HttpException } from "@/exceptions/HttpException";
import { Prisma, PrismaClient, UserStory } from "@prisma/client";

class UserStoryService {
  public userStories = new PrismaClient().userStory;

  public getAllUserStories() {
    return this.userStories.findMany();
  }

  public async getUserStoryById(id: number) {
    const findUserStory = await this.userStories.findUnique({
      where: {
        id,
      },
    });

    if (!findUserStory) throw new HttpException(400, "User story does not exist");
    return findUserStory;
  }

  public async getUserStoriesInSprint(sprintId: number) {
    if (!sprintId) throw new HttpException(400, "Missing sprint id");
    return this.userStories.findMany({
      where: {
        sprintId,
      },
    });
  }

  public async getUserStoriesInEpic(epicId: number) {
    if (!epicId) throw new HttpException(400, "Missing epic id");

    return this.userStories.findMany({
      where: {
        epicId,
      },
    });
  }

  public async addUserStory(userStoryData: CreateUserStoryDto) {
    const createUserStory = await this.userStories.create({
      data: {
        ...(userStoryData as UserStory),
      },
    });
    return createUserStory;
  }

  public async updateUserStory(id: number, userStory: CreateUserStoryDto) {
    if (!id) throw new HttpException(400, "Missing user story id");

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
