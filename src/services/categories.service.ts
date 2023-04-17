import { PrismaClient } from "@prisma/client";

class CategoriesService {
  public categories = new PrismaClient().category;

  public async countCategories() {
    return await this.categories.count();
  }
}

export default CategoriesService;
