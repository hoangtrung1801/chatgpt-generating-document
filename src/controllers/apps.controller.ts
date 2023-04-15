import { HttpException } from "@/exceptions/HttpException";
import { isEmpty } from "@/utils/util";
import { App, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class AppsController {
  public apps = new PrismaClient().app;

  public getApps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllsData: App[] = await this.apps.findMany();

      res.status(200).json({ data: findAllsData, message: "Found all apps" });
    } catch (error) {
      next(error);
    }
  };

  public getAppById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appId = Number(req.params.id);
      if (isEmpty(appId)) throw new HttpException(400, "appId is empty");

      const findAppData: App = await this.apps.findUnique({
        where: { id: appId },
        include: {
          questions: true,
        },
      });

      res.status(200).json({ data: findAppData, message: "found app by id" });
    } catch (error) {
      next(error);
    }
  };

  public createApp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appData = req.body;
      const createAppData: App = await this.apps.create({
        data: appData,
      });

      res.status(201).json({ data: createAppData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateApp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appId = Number(req.params.id);
      const appData: Partial<App> = req.body;
      const updateAppData: App = await this.apps.update({
        where: {
          id: appId,
        },
        data: appData,
      });

      res.status(200).json({ data: updateAppData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteApp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appId = Number(req.params.id);

      const findApp = await this.apps.findUnique({ where: { id: appId } });
      if (!findApp) throw new HttpException(409, "App does not exist");

      const deleteAppData: App = await this.apps.delete({ where: { id: appId } });

      res.status(200).json({ data: deleteAppData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default AppsController;
