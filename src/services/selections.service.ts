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
}

export default SelectionService;
