import { PrismaClient } from "@prisma/client";

class TaskService {
  public tasks = new PrismaClient().task;

  public async addTask(title: string, selectionId: number) {
    const createTask = await this.tasks.create({
      data: {
        title,
        selection: {
          connect: {
            id: selectionId,
          },
        },
      },
    });
    return createTask;
  }
}

export default TaskService;
