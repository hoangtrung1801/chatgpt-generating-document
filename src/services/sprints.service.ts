import { CreateSprintDto } from "@/dtos/sprints.dto";
import { PrismaClient } from "@prisma/client";

class SprintsService {
  public sprints = new PrismaClient().sprint;

  public getAllSprints = async () => {
    const allSprints = await this.sprints.findMany();
    return allSprints;
  };

  public getSprintById = async (id: number) => {
    const findSprint = await this.sprints.findUnique({
      where: {
        id,
      },
      include: {
        userStories: true,
      },
    });
    return findSprint;
  };

  public getSprintsInSelection = async (selectionId: number) => {
    const sprintsInSelection = await this.sprints.findMany({
      where: {
        selectionId,
      },
    });
    return sprintsInSelection;
  };

  public createSprint = async (sprintData: CreateSprintDto) => {
    const createSprint = await this.sprints.create({
      data: {
        ...sprintData,
        startDate: new Date(sprintData.startDate),
        endDate: new Date(sprintData.endDate),
      },
    });
    return createSprint;
  };

  public updateSprint = async (id: number, sprintData: CreateSprintDto) => {
    const updateSprint = await this.sprints.update({
      where: {
        id,
      },
      data: {
        ...sprintData,
      },
    });
    return updateSprint;
  };
}

export default SprintsService;
