import { PrismaClient } from "@prisma/client";

class OptionsService {
  public options = new PrismaClient().option;

  public async countOptions() {
    return await this.options.count();
  }
}

export default OptionsService;
