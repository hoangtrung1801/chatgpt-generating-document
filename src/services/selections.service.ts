import { CreateSelectionDto } from "@/dtos/selections.dto";
import { HttpException } from "@/exceptions/HttpException";
import { PrismaClient } from "@prisma/client";

class SelectionService {
  public selections = new PrismaClient().selection;

  public getSelectionById = async (selectionId: number) => {
    const findSelection = await this.selections.findUnique({
      where: { id: selectionId },
    });

    if (!findSelection) throw new HttpException(400, "Selection does not exist");
    return findSelection;
  };

  public getBriefOfSelection = async (selectionId: number) => {
    const findSelection = await this.selections.findUnique({
      where: { id: selectionId },
      include: {
        chatGPTBriefAnswer: true,
      },
    });

    if (!findSelection) throw new HttpException(400, "Selection does not exist");
    return findSelection.chatGPTBriefAnswer;
  };

  public findCurrentUserSelections = async (userId: number) => {
    const findCurrentUserSelections = await this.selections.findMany({
      where: {
        userId,
      },
    });
    if (!findCurrentUserSelections) throw new HttpException(400, "Cannot find current user's selections");

    return findCurrentUserSelections;
  };

  public createSelection = async (selectionData: CreateSelectionDto, userId: number) => {
    const createSelectionData = await this.selections.create({
      data: {
        ...selectionData,
        selectedOptions: {
          createMany: {
            data: selectionData.selectedOptions.map(optionId => ({ optionId })),
          },
        },
        userId,
      },
    });

    if (!createSelectionData) throw new HttpException(400, "Cannot create selection");
    return createSelectionData;
  };
}

export default SelectionService;
