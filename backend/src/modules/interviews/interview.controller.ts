import { Request, Response, NextFunction } from 'express';
import { IInterviewService } from './interview.interface';
import { CreateInterviewDTO, UpdateInterviewDTO } from './interview.schema';

export class InterviewController {
  private interviewService: IInterviewService;

  constructor(interviewService: IInterviewService) {
    this.interviewService = interviewService;
  }

  public getByJob = async (
    req: Request<{ jobId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const interviews = await this.interviewService.getInterviewsByJobId(
        req.user!.id,
        req.params.jobId
      );
      res.status(200).json({
        status: 'success',
        message: 'Jadwal interview berhasil diambil',
        data: { interviews },
      });
    } catch (error) {
      next(error);
    }
  };

  public create = async (
    req: Request<{}, {}, CreateInterviewDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const interview = await this.interviewService.createInterview(req.user!.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Jadwal interview berhasil ditambahkan',
        data: { interview },
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request<{ id: string }, {}, UpdateInterviewDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.interviewService.updateInterview(
        req.user!.id,
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: 'success',
        message: 'Jadwal interview berhasil diperbarui',
        data: { interview: updated },
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
      await this.interviewService.deleteInterview(req.user!.id, req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Jadwal interview berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  };
}

