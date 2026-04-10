import { ApplicationModel } from '../models/Application.js';
import { Application } from '../types/index.js';

export class ApplicationService {
  static async createApplication(
    userId: string,
    data: Partial<Application>
  ): Promise<Application> {
    const application = new ApplicationModel({
      userId,
      ...data,
    });
    try {
      await application.save();
      return application;
    } catch (err: any) {
      const { formatDbError } = await import('../utils/errorFormatter.js');
      throw new Error(formatDbError(err));
    }
  }

  static async getApplicationsByUser(userId: string): Promise<Application[]> {
    return ApplicationModel.find({ userId }).sort({ createdAt: -1 });
  }

  static async getApplicationById(appId: string): Promise<Application | null> {
    return ApplicationModel.findById(appId);
  }

  static async updateApplication(
    appId: string,
    data: Partial<Application>
  ): Promise<Application | null> {
    return ApplicationModel.findByIdAndUpdate(appId, data, { new: true });
  }

  static async deleteApplication(appId: string): Promise<boolean> {
    const result = await ApplicationModel.findByIdAndDelete(appId);
    return !!result;
  }

  static async updateApplicationStatus(
    appId: string,
    status: string
  ): Promise<Application | null> {
    return ApplicationModel.findByIdAndUpdate(appId, { status }, { new: true });
  }
}
