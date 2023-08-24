import { PrismaClient } from "@prisma/client";

class AppsService {
  public apps = new PrismaClient().app;

  public async countApps() {
    return await this.apps.count();
  }
}

export default AppsService;
