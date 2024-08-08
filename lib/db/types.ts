import { AdapterAccount, AdapterAccountType, AdapterSession, AdapterUser, VerificationToken } from "@auth/core/adapters";
import type { ColumnType } from "kysely";
import type { GeneratedAlways } from "kysely";
import { Database as AuthDatabase } from "@auth/kysely-adapter";
import { Authenticator } from "@auth/core/types";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Account extends AdapterAccount {
    id: string;
    refresh_token: string | undefined;
    access_token: string | undefined;
    token_type: Lowercase<string> | undefined;
    scope: string | undefined;
    id_token: string | undefined;
    session_state: string | null;
}

export interface Session {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;  // Changed from Timestamp to Date
}

export interface User extends AdapterUser {
    net_spend: Generated<number | null>;
    input_token_usage: Generated<number | null>;
    output_token_usage: Generated<number | null>;
    max_lesson_sessions: Generated<number | null>;
    max_lesson_creation: Generated<number | null>;
    quiz_usage: Generated<number | null>;
    published_quiz_usage: Generated<number | null>;
    max_quiz_previews: Generated<number | null>;
    max_quiz_creation: Generated<number | null>;
    max_net_spend: Generated<number | null>;
    max_documents: Generated<number | null>;
    max_document_size: Generated<number | null>;
}

export interface Document {
    id: Generated<number>;
    name: string;
    path: string;
    type: string;
    contextSize: number;
    userId: string;
}

export interface GeneratedModuleContent {
    id: Generated<number>;
    timestamp: Generated<Timestamp>;
    moduleId: number;
    content: string;
    contentType: string;
    contentOrder: number;
    sessionID: string;
}

export interface InteractionLog {
    id: Generated<number>;
    userId: string;
    lessonId: string | null;
    moduleId: number | null;
    interactionType: string;
    details: string | null;
    timestamp: Generated<Timestamp>;
    data: string | null;
}

export interface Lesson {
    id: Generated<string>;
    name: string;
    description: string;
    userId: string;
}

export interface LessonMessage {
    id: string;
    content: string;
    createdAt: Generated<Timestamp>;
    role: string;
    moduleId: number;
    lessonId: string;
    sessionId: string;
    isSystem: Generated<boolean>;
}

export interface LessonModuleState {
    id: Generated<number>;
    userId: string;
    lessonId: string;
    sessionId: string;
    moduleId: number;
    completed: Generated<boolean>;
    lastAccessed: Generated<Timestamp>;
}

export interface LessonSession {
    id: string;
    lessonId: string;
    userId: string;
    startTime: Timestamp;
    endTime: Timestamp | null;
    completed: Generated<boolean>;
    elapsedTime: number | null;
    currentModuleId: number | null;
    lastChangeTime: Timestamp | null;
}

export interface Module {
    id: Generated<number>;
    lessonId: string;
    moduleNumber: number;
    moduleType: string;
    topic: string;
    description: string;
    question: string | null;
    options: string | null;
    text_content: string | null;
    isInteractive: Generated<boolean>;
    answer: string | null;
    answers: string | null;
}

export interface ModuleAttempt {
    id: Generated<number>;
    moduleId: number;
    userId: string;
    lessonSessionId: string;
    attemptNumber: number;
    success: boolean;
    response: string | null;
    timestamp: Generated<Timestamp>;
}

export interface Database extends AuthDatabase {
    User: User;
    Account: Account;
    Session: AdapterSession;
    VerificationToken: VerificationToken;
    Authenticator: Authenticator;
    Document: Document;
    GeneratedModuleContent: GeneratedModuleContent;
    InteractionLog: InteractionLog;
    Lesson: Lesson;
    LessonMessage: LessonMessage;
    LessonModuleState: LessonModuleState;
    LessonSession: LessonSession;
    Module: Module;
    ModuleAttempt: ModuleAttempt;
}