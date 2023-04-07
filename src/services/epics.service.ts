import { CreateEpicDto } from "@/dtos/epics.dto";
import { HttpException } from "@/exceptions/HttpException";
import { PrismaClient } from "@prisma/client";

class EpicsService {
  public epics = new PrismaClient().epic;

  public getAllEpics = async () => {
    const allEpics = await this.epics.findMany();
    return allEpics;
  };

  public getEpicsInSelection = async (selectionId: number) => {
    if (!selectionId) throw new HttpException(400, "Missing selection id");

    const epicsInSelection = await this.epics.findMany({
      where: {
        selectionId,
      },
    });
    return epicsInSelection;
  };

  public getEpicById = async (id: number) => {
    if (!id) throw new HttpException(400, "Missing epic id");

    const findEpic = await this.epics.findUnique({
      where: {
        id,
      },
    });
    if (!findEpic) throw new HttpException(400, "Epic does not exist");
    return findEpic;
  };

  public createEpic = async (epicData: CreateEpicDto) => {
    const createEpic = await this.epics.create({
      data: {
        ...epicData,
      },
    });
    return createEpic;
  };

  public updateEpic = async (id: number, epicData: CreateEpicDto) => {
    if (!id) throw new HttpException(400, "Missing epic id");

    const findEpic = await this.epics.findUnique({
      where: {
        id,
      },
    });
    if (!findEpic) throw new HttpException(400, "Epic does not exist");

    const updateEpic = await this.epics.update({
      where: {
        id,
      },
      data: {
        ...epicData,
      },
    });
    return updateEpic;
  };
}

export default EpicsService;
