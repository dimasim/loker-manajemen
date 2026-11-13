-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('WISHLIST', 'APPLIED', 'TEST', 'INTERVIEW_HR', 'INTERVIEW_USER', 'OFFERING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "InterviewStage" AS ENUM ('HR_INTERVIEW', 'TECH_TEST', 'USER_INTERVIEW', 'FINAL_INTERVIEW', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'USER',
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_platforms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "url" VARCHAR(255),

    CONSTRAINT "job_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform_id" INTEGER,
    "company_name" VARCHAR(150) NOT NULL,
    "position" VARCHAR(150) NOT NULL,
    "job_url" TEXT,
    "location" VARCHAR(100),
    "work_type" "WorkType" NOT NULL DEFAULT 'REMOTE',
    "expected_salary" DECIMAL(12,2),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'WISHLIST',
    "applied_date" DATE,
    "deadline" DATE,
    "resume_used" VARCHAR(150),
    "hr_contact" VARCHAR(150),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "stage" "InterviewStage" NOT NULL DEFAULT 'HR_INTERVIEW',
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "meeting_link" TEXT,
    "interviewer" VARCHAR(150),
    "notes" TEXT,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "job_platforms_name_key" ON "job_platforms"("name");

-- CreateIndex
CREATE INDEX "job_applications_user_id_idx" ON "job_applications"("user_id");

-- CreateIndex
CREATE INDEX "job_applications_user_id_status_idx" ON "job_applications"("user_id", "status");

-- CreateIndex
CREATE INDEX "interviews_application_id_idx" ON "interviews"("application_id");

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "job_platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
