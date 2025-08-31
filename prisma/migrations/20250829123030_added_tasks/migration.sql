/*
  Warnings:

  - You are about to drop the column `banExpries` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "App" AS ENUM ('BONUS', 'MERIT');

-- CreateEnum
CREATE TYPE "Project" AS ENUM ('PROJECT', 'IMPROVEMENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_DRAFT', 'PENDING_CHECKER', 'REJECTED_BY_CHECKER', 'PENDING_APPROVER', 'REJECTED_BY_APPROVER', 'APPROVED');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('IN_DRAFT', 'EVALUATION_1ST', 'EVALUATION_2ND');

-- CreateEnum
CREATE TYPE "CompetencyType" AS ENUM ('CC', 'FC', 'MC', 'TC');

-- AlterEnum
ALTER TYPE "Division" ADD VALUE 'COMMERCIAL';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "banExpries",
ADD COLUMN     "banExpires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "type" "App" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "preparedBy" TEXT NOT NULL,
    "checkedBy" TEXT,
    "approvedBy" TEXT NOT NULL,
    "preparedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpiForm" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isEvaluated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "kpiForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpiEvaluation" (
    "id" TEXT NOT NULL,
    "period" "Period" NOT NULL,
    "actual" TEXT NOT NULL,
    "achievement" INTEGER NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "kpiEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "weight" INTEGER,
    "objective" TEXT,
    "strategy" TEXT,
    "target100" TEXT,
    "target80" TEXT,
    "target90" TEXT,
    "target70" TEXT,
    "type" "Project",
    "definition" TEXT,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kpiFormId" TEXT NOT NULL,

    CONSTRAINT "kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "definition" TEXT,
    "t5" TEXT,
    "t4" TEXT,
    "t3" TEXT,
    "t2" TEXT,
    "t1" TEXT,
    "type" "CompetencyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencyRecord" (
    "id" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "weight" INTEGER,
    "input" TEXT,
    "output" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencyEvaluation" (
    "id" TEXT NOT NULL,
    "period" "Period" NOT NULL,
    "inputEvidence" TEXT NOT NULL,
    "outputEvidence" TEXT NOT NULL,
    "inputLevel" INTEGER NOT NULL DEFAULT 0,
    "outputLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "competencyRecordId" TEXT NOT NULL,

    CONSTRAINT "competencyEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencyForm" (
    "id" TEXT NOT NULL,

    CONSTRAINT "competencyForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meritForm" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "competencyFormId" TEXT NOT NULL,
    "cultureFormId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "period" "Period" NOT NULL DEFAULT 'IN_DRAFT',

    CONSTRAINT "meritForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "culture" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(1) NOT NULL,
    "description" TEXT NOT NULL,
    "belief" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "culture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultureItem" (
    "id" TEXT NOT NULL,
    "cultureId" INTEGER NOT NULL,
    "period" "Period" NOT NULL,
    "levelBehavior" INTEGER NOT NULL DEFAULT 0,
    "evidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultureItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultureForm" (
    "id" TEXT NOT NULL,
    "cultureEvaluationId" TEXT NOT NULL,

    CONSTRAINT "cultureForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "approval_taskId_key" ON "approval"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "kpiForm_taskId_key" ON "kpiForm"("taskId");

-- CreateIndex
CREATE INDEX "kpiForm_taskId_year_isEvaluated_idx" ON "kpiForm"("taskId", "year", "isEvaluated");

-- CreateIndex
CREATE UNIQUE INDEX "kpiForm_taskId_year_isEvaluated_key" ON "kpiForm"("taskId", "year", "isEvaluated");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_id_key" ON "kpis"("id");

-- CreateIndex
CREATE UNIQUE INDEX "meritForm_taskId_key" ON "meritForm"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "meritForm_competencyFormId_key" ON "meritForm"("competencyFormId");

-- CreateIndex
CREATE UNIQUE INDEX "meritForm_cultureFormId_key" ON "meritForm"("cultureFormId");

-- CreateIndex
CREATE INDEX "meritForm_taskId_year_idx" ON "meritForm"("taskId", "year");

-- CreateIndex
CREATE INDEX "meritForm_year_competencyFormId_cultureFormId_idx" ON "meritForm"("year", "competencyFormId", "cultureFormId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval" ADD CONSTRAINT "approval_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval" ADD CONSTRAINT "approval_preparedBy_fkey" FOREIGN KEY ("preparedBy") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval" ADD CONSTRAINT "approval_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval" ADD CONSTRAINT "approval_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpiForm" ADD CONSTRAINT "kpiForm_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpiEvaluation" ADD CONSTRAINT "kpiEvaluation_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "kpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_kpiFormId_fkey" FOREIGN KEY ("kpiFormId") REFERENCES "kpiForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencyRecord" ADD CONSTRAINT "competencyRecord_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencyEvaluation" ADD CONSTRAINT "competencyEvaluation_competencyRecordId_fkey" FOREIGN KEY ("competencyRecordId") REFERENCES "competencyRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meritForm" ADD CONSTRAINT "meritForm_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meritForm" ADD CONSTRAINT "meritForm_competencyFormId_fkey" FOREIGN KEY ("competencyFormId") REFERENCES "competencyForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meritForm" ADD CONSTRAINT "meritForm_cultureFormId_fkey" FOREIGN KEY ("cultureFormId") REFERENCES "cultureForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultureItem" ADD CONSTRAINT "cultureItem_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "culture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultureForm" ADD CONSTRAINT "cultureForm_cultureEvaluationId_fkey" FOREIGN KEY ("cultureEvaluationId") REFERENCES "cultureItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
