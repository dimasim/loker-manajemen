import { Request, Response, NextFunction } from 'express';
import { IJobService } from './job.interface';
import { CreateJobDTO, UpdateJobDTO, UpdateJobStatusDTO, JobQueryDTO } from './job.schema';

export class JobController {
  private jobService: IJobService;

  constructor(jobService: IJobService) {
    this.jobService = jobService;
  }

  public getAll = async (
    req: Request<{}, {}, {}, JobQueryDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const jobs = await this.jobService.getJobs(req.user!.id, req.query);
      res.status(200).json({
        status: 'success',
        message: 'Daftar lowongan kerja berhasil diambil',
        data: { total: jobs.length, jobs },
      });
    } catch (error) {
      next(error);
    }
  };

  public getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.jobService.getJobStats(req.user!.id);
      res.status(200).json({
        status: 'success',
        message: 'Statistik status lamaran berhasil diambil',
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const job = await this.jobService.getJobById(req.user!.id, req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Detail lowongan kerja berhasil diambil',
        data: { job },
      });
    } catch (error) {
      next(error);
    }
  };

  public create = async (
    req: Request<{}, {}, CreateJobDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newJob = await this.jobService.createJob(req.user!.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Lowongan kerja berhasil dicatat',
        data: { job: newJob },
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request<{ id: string }, {}, UpdateJobDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updatedJob = await this.jobService.updateJob(req.user!.id, req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Data lowongan kerja berhasil diperbarui',
        data: { job: updatedJob },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (
    req: Request<{ id: string }, {}, UpdateJobStatusDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updatedJob = await this.jobService.updateJobStatus(
        req.user!.id,
        req.params.id,
        req.body.status
      );
      res.status(200).json({
        status: 'success',
        message: 'Status tahapan lamaran berhasil diubah',
        data: { job: updatedJob },
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.jobService.deleteJob(req.user!.id, req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Lowongan kerja berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  };
}

