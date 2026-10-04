import { UserRole } from "@prisma/client";
import { SessionPayload } from "./auth";

// Granular RBAC Permissions
export const PERMISSIONS = {
  // POS
  POS_ACCESS: "pos:access",
  POS_SESSION_OPEN: "pos:session:open",
  POS_SESSION_CLOSE: "pos:session:close",
  POS_ORDERS_CREATE: "pos:orders:create",
  POS_ORDERS_REFUND: "pos:orders:refund",
  POS_DISCOUNT_APPLY: "pos:discount:apply",

  // Inventory & Warehouse
  INVENTORY_VIEW: "inventory:view",
  INVENTORY_ADJUST: "inventory:stock:adjust",
  INVENTORY_TRANSFER: "inventory:warehouse:transfer",

  // Catalog
  CATALOG_VIEW: "catalog:view",
  CATALOG_CREATE: "catalog:create",
  CATALOG_UPDATE: "catalog:update",
  CATALOG_DELETE: "catalog:delete",
  CATALOG_PUBLISH: "catalog:publish",

  // Orders
  ORDERS_VIEW: "orders:view",
  ORDERS_UPDATE_STATUS: "orders:status:update",
  ORDERS_CANCEL: "orders:cancel",
  ORDERS_REFUND: "orders:refund",

  // Vendor Portal
  VENDOR_PRODUCTS_MANAGE: "vendor:products:manage",
  VENDOR_ORDERS_VIEW: "vendor:orders:view",
  VENDOR_PAYOUT_REQUEST: "vendor:payout:request",
  VENDOR_PAYOUT_APPROVE: "vendor:payout:approve",

  // Administration & System
  ADMIN_ACCESS: "admin:access",
  SETTINGS_MANAGE: "settings:manage",
  AUDIT_LOGS_VIEW: "audit_logs:view",
  REPORTS_FINANCIAL: "reports:financial",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role Default Permissions Matrix
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.CATALOG_VIEW,
    PERMISSIONS.CATALOG_CREATE,
    PERMISSIONS.CATALOG_UPDATE,
    PERMISSIONS.CATALOG_PUBLISH,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE_STATUS,
    PERMISSIONS.ORDERS_CANCEL,
    PERMISSIONS.ORDERS_REFUND,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.VENDOR_PAYOUT_APPROVE,
    PERMISSIONS.REPORTS_FINANCIAL,
    PERMISSIONS.AUDIT_LOGS_VIEW,
  ],
  VENDOR: [
    PERMISSIONS.VENDOR_PRODUCTS_MANAGE,
    PERMISSIONS.VENDOR_ORDERS_VIEW,
    PERMISSIONS.VENDOR_PAYOUT_REQUEST,
    PERMISSIONS.CATALOG_VIEW,
    PERMISSIONS.CATALOG_CREATE,
    PERMISSIONS.CATALOG_UPDATE,
  ],
  CUSTOMER: [],
  POS_OPERATOR: [
    PERMISSIONS.POS_ACCESS,
    PERMISSIONS.POS_SESSION_OPEN,
    PERMISSIONS.POS_SESSION_CLOSE,
    PERMISSIONS.POS_ORDERS_CREATE,
    PERMISSIONS.POS_ORDERS_REFUND,
    PERMISSIONS.POS_DISCOUNT_APPLY,
    PERMISSIONS.INVENTORY_VIEW,
  ],
  WAREHOUSE_STAFF: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE_STATUS,
  ],
  DELIVERY_STAFF: [
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE_STATUS,
  ],
  SUPPORT_STAFF: [
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.CATALOG_VIEW,
  ],
  ACCOUNTING_STAFF: [
    PERMISSIONS.REPORTS_FINANCIAL,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.VENDOR_PAYOUT_APPROVE,
    PERMISSIONS.AUDIT_LOGS_VIEW,
  ],
};

export function hasPermission(
  session: SessionPayload | null,
  permission: string
): boolean {
  if (!session) return false;
  if (session.role === "SUPER_ADMIN") return true;
  return session.permissions?.includes(permission) || false;
}

export function hasRole(
  session: SessionPayload | null,
  allowedRoles: UserRole[]
): boolean {
  if (!session) return false;
  if (session.role === "SUPER_ADMIN") return true;
  return allowedRoles.includes(session.role);
}
