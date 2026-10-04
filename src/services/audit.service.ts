import prisma from "@/lib/db";

export interface CreateAuditLogParams {
  actorId?: string;
  action: string;
  entity: string;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Records an immutable audit log entry for security and regulatory compliance.
   */
  static async record(params: CreateAuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          oldValues: params.oldValues as any,
          newValues: params.newValues as any,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      // In development fallback or if DB is offline, log to standard audit stdout
      console.warn(`[AUDIT_LOG_FALLBACK] ${params.action} on ${params.entity}:${params.entityId}`, params);
      return null;
    }
  }

  static async getRecentLogs(limit = 50) {
    try {
      return await prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });
    } catch {
      return [];
    }
  }
}
