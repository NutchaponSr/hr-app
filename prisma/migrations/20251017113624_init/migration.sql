-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Division" AS ENUM ('SAT', 'ICP2', 'SAA', 'SFT1', 'SBM', 'SFT3', 'SFT2', 'SBM_AUTO', 'SDS', 'ICP1', 'SBM_NON_AUTO', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('President', 'MD', 'VP', 'GM', 'AGM', 'MGR', 'SMGR', 'Chief', 'Foreman', 'Staff', 'Worker', 'Officer');

-- CreateEnum
CREATE TYPE "App" AS ENUM ('BONUS', 'MERIT');

-- CreateEnum
CREATE TYPE "Project" AS ENUM ('PROJECT', 'IMPROVEMENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_DRAFT', 'PENDING_CHECKER', 'REJECTED_BY_CHECKER', 'PENDING_APPROVER', 'REJECTED_BY_APPROVER', 'APPROVED');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('IN_DRAFT', 'EVALUATION_1ST', 'EVALUATION_2ND');

-- CreateEnum
CREATE TYPE "KpiCategory" AS ENUM ('FP', 'CP', 'IP', 'L_G');

-- CreateEnum
CREATE TYPE "CompetencyType" AS ENUM ('CC', 'FC', 'MC', 'TC');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "username" TEXT NOT NULL,
    "displayUsername" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "impersonatedBy" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" VARCHAR(10) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "position" TEXT NOT NULL,
    "division" "Division" NOT NULL,
    "level" "Position" NOT NULL,
    "rank" "Position" NOT NULL,
    "department" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "connectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "type" "App" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "preparedBy" TEXT NOT NULL,
    "checkedBy" TEXT,
    "approvedBy" TEXT NOT NULL,
    "preparedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpiForm" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "period" "Period" NOT NULL DEFAULT 'IN_DRAFT',
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpiForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meritForm" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "period" "Period" NOT NULL DEFAULT 'IN_DRAFT',
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meritForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpiEvaluation" (
    "id" TEXT NOT NULL,
    "period" "Period" NOT NULL,
    "actualOwner" TEXT,
    "achievementOwner" INTEGER,
    "actualChecker" TEXT,
    "achievementChecker" INTEGER,
    "actualApprover" TEXT,
    "achievementApprover" INTEGER,
    "fileUrl" TEXT,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "kpiEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "category" "KpiCategory",
    "weight" INTEGER NOT NULL DEFAULT 0,
    "objective" TEXT,
    "strategy" TEXT,
    "target100" TEXT,
    "target80" TEXT,
    "target90" TEXT,
    "target70" TEXT,
    "definition" TEXT,
    "type" "Project",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kpiFormId" TEXT NOT NULL,

    CONSTRAINT "kpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultureRecord" (
    "id" TEXT NOT NULL,
    "cultureId" INTEGER NOT NULL,
    "meritFormId" TEXT NOT NULL,
    "evidence" TEXT,

    CONSTRAINT "cultureRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultureEvaluation" (
    "id" TEXT NOT NULL,
    "cultureRecordId" TEXT NOT NULL,
    "period" "Period" NOT NULL,
    "levelBehaviorOwner" INTEGER,
    "levelBehaviorChecker" INTEGER,
    "levelBehaviorApprover" INTEGER,
    "actualOwner" TEXT,
    "actualChecker" TEXT,
    "actualApprover" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultureEvaluation_pkey" PRIMARY KEY ("id")
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
    "competencyId" TEXT,
    "meritFormId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "expectedLevel" VARCHAR(1),
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
    "inputEvidenceOwner" TEXT,
    "outputEvidenceOwner" TEXT,
    "levelOwner" INTEGER,
    "inputEvidenceChecker" TEXT,
    "outputEvidenceChecker" TEXT,
    "levelChecker" INTEGER,
    "inputEvidenceApprover" TEXT,
    "outputEvidenceApprover" TEXT,
    "levelApprover" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "competencyRecordId" TEXT NOT NULL,

    CONSTRAINT "competencyEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE INDEX "comment_createdBy_idx" ON "comment"("createdBy");

-- CreateIndex
CREATE INDEX "task_preparedBy_idx" ON "task"("preparedBy");

-- CreateIndex
CREATE INDEX "task_checkedBy_idx" ON "task"("checkedBy");

-- CreateIndex
CREATE INDEX "task_approvedBy_idx" ON "task"("approvedBy");

-- CreateIndex
CREATE INDEX "task_fileId_idx" ON "task"("fileId");

-- CreateIndex
CREATE INDEX "kpiForm_employeeId_idx" ON "kpiForm"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "kpiForm_year_employeeId_key" ON "kpiForm"("year", "employeeId");

-- CreateIndex
CREATE INDEX "meritForm_year_employeeId_idx" ON "meritForm"("year", "employeeId");

-- CreateIndex
CREATE INDEX "meritForm_employeeId_idx" ON "meritForm"("employeeId");

-- CreateIndex
CREATE INDEX "kpiEvaluation_kpiId_idx" ON "kpiEvaluation"("kpiId");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_id_key" ON "kpi"("id");

-- CreateIndex
CREATE INDEX "kpi_kpiFormId_idx" ON "kpi"("kpiFormId");

-- CreateIndex
CREATE INDEX "cultureRecord_meritFormId_idx" ON "cultureRecord"("meritFormId");

-- CreateIndex
CREATE INDEX "cultureRecord_cultureId_idx" ON "cultureRecord"("cultureId");

-- CreateIndex
CREATE INDEX "cultureEvaluation_cultureRecordId_idx" ON "cultureEvaluation"("cultureRecordId");

-- CreateIndex
CREATE INDEX "competencyRecord_competencyId_idx" ON "competencyRecord"("competencyId");

-- CreateIndex
CREATE INDEX "competencyRecord_meritFormId_idx" ON "competencyRecord"("meritFormId");

-- CreateIndex
CREATE INDEX "competencyEvaluation_competencyRecordId_idx" ON "competencyEvaluation"("competencyRecordId");
