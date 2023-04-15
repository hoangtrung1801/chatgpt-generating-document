import { HttpException } from "@/exceptions/HttpException";
import { isEmpty } from "@/utils/util";
import { Category, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class CategoriesController {
  public categories = new PrismaClient().category;

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllsData: Category[] = await this.categories.findMany();

      res.status(200).json({ data: findAllsData, message: "Found all categories" });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = Number(req.params.id);
      if (isEmpty(categoryId)) throw new HttpException(400, "categoryId is empty");

      const findCategoryData: Category = await this.categories.findUnique({
        where: { id: categoryId },
        include: {
          apps: true,
        },
      });

      res.status(200).json({ data: findCategoryData, message: "found category by id" });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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

      const deleteCategory: Category = await this.categories.delete({ where: { id: categoryId } });

      res.status(200).json({ data: deleteCategory, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoriesController;
