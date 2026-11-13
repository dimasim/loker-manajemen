import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { JobApiService } from '../services/job.api';
import {
  JobApplication,
  Platform,
  CreateJobPayload,
  CreateInterviewPayload,
  ApplicationStatus,
} from '../types/job.types';

export const useJobStore = defineStore('jobs', () => {
  const jobs = ref<JobApplication[]>([]);
  const platforms = ref<Platform[]>([]);
  const stats = ref<Record<string, number>>({});
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Filters & View Mode
  const searchQuery = ref<string>('');
  const filterWorkType = ref<string>('');
  const viewMode = ref<'kanban' | 'table'>('kanban');

  // Selected Job for Detail Modal
  const selectedJob = ref<JobApplication | null>(null);

  /**
   * Filtered jobs based on search & workType
   */
  const filteredJobs = computed(() => {
    return jobs.value.filter((job) => {
      const matchSearch =
        !searchQuery.value ||
        job.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        job.position.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(searchQuery.value.toLowerCase()));

      const matchWorkType =
        !filterWorkType.value || job.workType === filterWorkType.value;

      return matchSearch && matchWorkType;
    });
  });

  /**
   * Group jobs by status for Kanban Board
   */
  const jobsByStatus = computed(() => {
    const columns: Record<ApplicationStatus, JobApplication[]> = {
      WISHLIST: [],
      APPLIED: [],
      TEST: [],
      INTERVIEW_HR: [],
      INTERVIEW_USER: [],
      OFFERING: [],
      ACCEPTED: [],
      REJECTED: [],
      WITHDRAWN: [],
    };

    filteredJobs.value.forEach((job) => {
      if (columns[job.status]) {
        columns[job.status].push(job);
      }
    });

    return columns;
  });

  /**
   * Fetch all data
   */
  const fetchAll = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const [jobsData, platformsData, statsData] = await Promise.all([
        JobApiService.getJobs(),
        JobApiService.getPlatforms(),
        JobApiService.getStats(),
      ]);
      jobs.value = jobsData;
      platforms.value = platformsData;
      stats.value = statsData;
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat data lowongan';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create new job
   */
  const createJob = async (payload: CreateJobPayload) => {
    isLoading.value = true;
    try {
      const newJob = await JobApiService.createJob(payload);
      jobs.value.unshift(newJob);
      await fetchStats();
      return newJob;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Gagal menyimpan loker');
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update status (e.g. from Kanban drag/drop or dropdown)
   */
  const updateJobStatus = async (id: string, newStatus: ApplicationStatus) => {
    const jobIndex = jobs.value.findIndex((j) => j.id === id);
    if (jobIndex === -1) return;

    // Optimistic UI update
    const previousStatus = jobs.value[jobIndex].status;
    jobs.value[jobIndex].status = newStatus;

    try {
      const updated = await JobApiService.updateJobStatus(id, newStatus);
      jobs.value[jobIndex] = updated;
      if (selectedJob.value?.id === id) {
        selectedJob.value = updated;
      }
      await fetchStats();
    } catch (err) {
      // Rollback on error
      jobs.value[jobIndex].status = previousStatus;
      throw err;
    }
  };

  /**
   * Delete job
   */
  const deleteJob = async (id: string) => {
    try {
      await JobApiService.deleteJob(id);
      jobs.value = jobs.value.filter((j) => j.id !== id);
      if (selectedJob.value?.id === id) {
        selectedJob.value = null;
      }
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Gagal menghapus loker');
    }
  };

  /**
   * Add interview schedule
   */
  const addInterview = async (payload: CreateInterviewPayload) => {
    try {
      const newInterview = await JobApiService.createInterview(payload);
      const job = jobs.value.find((j) => j.id === payload.applicationId);
      if (job) {
        if (!job.interviews) job.interviews = [];
        job.interviews.push(newInterview);
      }
      if (selectedJob.value?.id === payload.applicationId) {
        if (!selectedJob.value.interviews) selectedJob.value.interviews = [];
        selectedJob.value.interviews.push(newInterview);
      }
      return newInterview;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Gagal menambah jadwal');
    }
  };

  const fetchStats = async () => {
    try {
      stats.value = await JobApiService.getStats();
    } catch (err) {
      console.error(err);
    }
  };

  const selectJob = (job: JobApplication) => {
    selectedJob.value = job;
  };

  const clearSelectedJob = () => {
    selectedJob.value = null;
  };

  return {
    jobs,
    platforms,
    stats,
    isLoading,
    error,
    searchQuery,
    filterWorkType,
    viewMode,
    selectedJob,
    filteredJobs,
    jobsByStatus,
    fetchAll,
    createJob,
    updateJobStatus,
    deleteJob,
    addInterview,
    selectJob,
    clearSelectedJob,
  };
});

