import { z } from 'zod';

// Base Types
export const IdSchema = z.string().uuid();
export type Id = z.infer<typeof IdSchema>;

export const OrgIdSchema = z.string().uuid();
export type OrgId = z.infer<typeof OrgIdSchema>;

export const TimestampSchema = z.coerce.date();
export type Timestamp = z.infer<typeof TimestampSchema>;

// User Roles & Permissions
export const UserRoleSchema = z.enum(['owner', 'admin', 'manager', 'tech', 'sales', 'viewer']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const PermissionSchema = z.enum([
  'org:read', 'org:write', 'org:delete', 'org:manage_members',
  'project:create', 'project:read', 'project:write', 'project:delete',
  'lead:create', 'lead:read', 'lead:write', 'lead:delete',
  'task:create', 'task:read', 'task:write', 'task:complete',
  'doc:upload', 'doc:read', 'doc:write', 'doc:delete',
  'ai:ask', 'ai:transform',
  'approval:view', 'approval:decide',
  'message:draft', 'message:send',
  'time:entry', 'time:approve',
  'jobcost:read', 'jobcost:write',
  'co:draft', 'co:approve',
  'procurement:read', 'procurement:write',
  'schedule:read', 'schedule:write', 'schedule:apply',
]);
export type Permission = z.infer<typeof PermissionSchema>;

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: Object.values(PermissionSchema.enum) as Permission[],
  admin: Object.values(PermissionSchema.enum) as Permission[],
  manager: [
    'org:read', 'project:create', 'project:read', 'project:write',
    'lead:create', 'lead:read', 'lead:write',
    'task:create', 'task:read', 'task:write', 'task:complete',
    'doc:upload', 'doc:read', 'doc:write',
    'ai:ask', 'ai:transform',
    'approval:view', 'approval:decide',
    'message:draft', 'message:send',
    'time:entry', 'time:approve',
    'jobcost:read', 'jobcost:write',
    'co:draft', 'co:approve',
    'procurement:read', 'procurement:write',
    'schedule:read', 'schedule:write', 'schedule:apply',
  ],
  tech: ['org:read', 'project:read', 'task:read', 'task:complete', 'doc:upload', 'doc:read', 'ai:ask', 'time:entry', 'schedule:read'],
  sales: ['org:read', 'project:read', 'lead:create', 'lead:read', 'lead:write', 'doc:upload', 'doc:read', 'ai:ask', 'ai:transform', 'message:draft', 'schedule:read'],
  viewer: ['org:read', 'project:read', 'lead:read', 'task:read', 'doc:read', 'schedule:read'],
};

export interface AuthContext {
  userId: Id;
  orgId: OrgId;
  role: UserRole;
  permissions: Permission[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  meta?: { page?: number; limit?: number; total?: number };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const ProjectStatusSchema = z.enum(['lead', 'proposal', 'contracted', 'in_progress', 'on_hold', 'completed', 'cancelled']);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'blocked', 'completed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const DocumentStatusSchema = z.enum(['uploaded', 'classified', 'ocr_done', 'extracted', 'confirmed', 'failed']);
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

export const ApprovalStatusSchema = z.enum(['pending', 'approved', 'rejected', 'expired']);
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

export const IntakeItemStatusSchema = z.enum(['pending', 'analyzing', 'ready_for_review', 'confirmed', 'dismissed']);
export type IntakeItemStatus = z.infer<typeof IntakeItemStatusSchema>;
