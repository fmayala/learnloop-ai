-- AlterTable
ALTER TABLE "User" ADD COLUMN     "input_token_usage" INTEGER DEFAULT 0,
ADD COLUMN     "max_document_size" INTEGER DEFAULT 5,
ADD COLUMN     "max_documents" INTEGER DEFAULT 5,
ADD COLUMN     "max_lesson_creation" INTEGER DEFAULT 5,
ADD COLUMN     "max_lesson_sessions" INTEGER DEFAULT 100,
ADD COLUMN     "max_net_spend" DOUBLE PRECISION DEFAULT 1,
ADD COLUMN     "max_quiz_creation" INTEGER DEFAULT 10,
ADD COLUMN     "max_quiz_previews" INTEGER DEFAULT 15,
ADD COLUMN     "net_spend" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "output_token_usage" INTEGER DEFAULT 0,
ADD COLUMN     "published_quiz_usage" INTEGER DEFAULT 0,
ADD COLUMN     "quiz_usage" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSession" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "elapsedTime" INTEGER,
    "currentModuleId" INTEGER,
    "lastChangeTime" TIMESTAMP(3),

    CONSTRAINT "LessonSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "lessonId" TEXT NOT NULL,
    "moduleNumber" INTEGER NOT NULL,
    "moduleType" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "question" TEXT,
    "options" TEXT,
    "text_content" TEXT,
    "isInteractive" BOOLEAN NOT NULL DEFAULT false,
    "answer" TEXT,
    "answers" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonModuleState" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonModuleState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contextSize" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "lessonId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LessonMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAttempt" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonSessionId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "response" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteractionLog" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT,
    "moduleId" INTEGER,
    "interactionType" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT,

    CONSTRAINT "InteractionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedModuleContent" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moduleId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentOrder" INTEGER NOT NULL,
    "sessionID" TEXT NOT NULL,

    CONSTRAINT "GeneratedModuleContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonSession_currentModuleId_idx" ON "LessonSession"("currentModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "Module_lessonId_moduleNumber_key" ON "Module"("lessonId", "moduleNumber");

-- CreateIndex
CREATE INDEX "LessonModuleState_userId_lessonId_moduleId_sessionId_idx" ON "LessonModuleState"("userId", "lessonId", "moduleId", "sessionId");

-- CreateIndex
CREATE INDEX "LessonMessage_sessionId_moduleId_lessonId_idx" ON "LessonMessage"("sessionId", "moduleId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonMessage_id_sessionId_key" ON "LessonMessage"("id", "sessionId");

-- CreateIndex
CREATE INDEX "ModuleAttempt_moduleId_userId_lessonSessionId_idx" ON "ModuleAttempt"("moduleId", "userId", "lessonSessionId");

-- CreateIndex
CREATE INDEX "InteractionLog_userId_lessonId_moduleId_idx" ON "InteractionLog"("userId", "lessonId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedModuleContent_moduleId_contentOrder_key" ON "GeneratedModuleContent"("moduleId", "contentOrder");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSession" ADD CONSTRAINT "LessonSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSession" ADD CONSTRAINT "LessonSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSession" ADD CONSTRAINT "LessonSession_currentModuleId_fkey" FOREIGN KEY ("currentModuleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonModuleState" ADD CONSTRAINT "LessonModuleState_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonModuleState" ADD CONSTRAINT "LessonModuleState_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonModuleState" ADD CONSTRAINT "LessonModuleState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonModuleState" ADD CONSTRAINT "LessonModuleState_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LessonSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonMessage" ADD CONSTRAINT "LessonMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LessonSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonMessage" ADD CONSTRAINT "LessonMessage_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonMessage" ADD CONSTRAINT "LessonMessage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAttempt" ADD CONSTRAINT "ModuleAttempt_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAttempt" ADD CONSTRAINT "ModuleAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAttempt" ADD CONSTRAINT "ModuleAttempt_lessonSessionId_fkey" FOREIGN KEY ("lessonSessionId") REFERENCES "LessonSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionLog" ADD CONSTRAINT "InteractionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionLog" ADD CONSTRAINT "InteractionLog_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionLog" ADD CONSTRAINT "InteractionLog_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedModuleContent" ADD CONSTRAINT "GeneratedModuleContent_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedModuleContent" ADD CONSTRAINT "GeneratedModuleContent_sessionID_fkey" FOREIGN KEY ("sessionID") REFERENCES "LessonSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
