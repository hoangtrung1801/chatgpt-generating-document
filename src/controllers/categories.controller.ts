import { HttpException } from "@/exceptions/HttpException";
import { isEmpty } from "@/utils/util";
import { Category, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class CategoriesController {
  public categories = new PrismaClient().category;

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllCategoriesData: Category[] = await this.categories.findMany();

      res.status(200).json({ data: findAllCategoriesData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = Number(req.params.id);
      if (isEmpty(categoryId)) throw new HttpException(400, "CategoryId is empty");

      const findCategoryData: Category = await this.categories.findUnique({
        where: { id: categoryId },
        include: {
          questions: true,
        },
      });

      res.status(200).json({ data: findCategoryData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // const userData: CreateUserDto = req.body;
      // const createUserData: User = await this.categoriesService.createUser(userData);

      const categoryData = req.body;
      const createCategoryData: Category = await this.categories.create({
        data: categoryData,
      });

      res.status(201).json({ data: createCategoryData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = Number(req.params.id);
      const categoryData: Partial<Category> = req.body;
      // const updateUserData: Category = await this.categoriesService.updateUser(categoryId, categoryData);
      const updateCategoryData: Category = await this.categories.update({
        where: {
          id: categoryId,
        },
        data: categoryData,
      });

      res.status(200).json({ data: updateCategoryData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = Number(req.params.id);

      const findCategory = await this.categories.findUnique({ where: { id: categoryId } });
      if (!findCategory) throw new HttpException(409, "Category does not exist");

      const deleteCategoryData: Category = await this.categories.delete({ where: { id: categoryId } });

      res.status(200).json({ data: deleteCategoryData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoriesController;
