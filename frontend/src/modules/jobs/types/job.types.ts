export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'TEST'
  | 'INTERVIEW_HR'
  | 'INTERVIEW_USER'
  | 'OFFERING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type WorkType = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export type InterviewStage =
  | 'HR_INTERVIEW'
  | 'TECH_TEST'
  | 'USER_INTERVIEW'
  | 'FINAL_INTERVIEW'
  | 'OTHER';

export interface Platform {
  id: number;
  name: string;
  url?: string | null;
}

export interface Interview {
  id: string;
  applicationId: string;
  stage: InterviewStage;
  scheduledAt: string;
  meetingLink?: string | null;
  interviewer?: string | null;
  notes?: string | null;
  isDone: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  platformId?: number | null;
  companyName: string;
  position: string;
  jobUrl?: string | null;
  location?: string | null;
  workType: WorkType;
  expectedSalary?: string | number | null;
  status: ApplicationStatus;
  appliedDate?: string | null;
  deadline?: string | null;
  resumeUsed?: string | null;
  hrContact?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  platform?: Platform | null;
  interviews?: Interview[];
}

export interface CreateJobPayload {
  companyName: string;
  position: string;
  jobUrl?: string;
  platformId?: number | null;
  location?: string;
  workType: WorkType;
  expectedSalary?: number | null;
  status: ApplicationStatus;
  appliedDate?: string | null;
  deadline?: string | null;
  resumeUsed?: string;
  hrContact?: string;
  notes?: string;
}

export interface CreateInterviewPayload {
  applicationId: string;
  stage: InterviewStage;
  scheduledAt: string;
  meetingLink?: string;
  interviewer?: string;
  notes?: string;
}

